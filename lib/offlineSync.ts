"use client";

type QueueItem = {
  url: string;
  method: "POST" | "DELETE" | "PUT" | "PATCH";
  data: any;
  time: number;
};

const QUEUE_KEY = "offline_queue";
const CACHE_PREFIX = "cached_";

function getQueue(): QueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return []; // FIX: Corrupt queue se crash nahi
  }
}

function saveQueue(queue: QueueItem[]) {
  // FIX: Max 50 items taake localStorage full na ho
  const trimmed = queue.slice(-50);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(trimmed));
}

function updateCacheForOffline(url: string, data: any, method: string) {
  const cacheKey = CACHE_PREFIX + url.replace("/api/", "").split("?")[0];
  try {
    const existing = JSON.parse(localStorage.getItem(cacheKey) || "[]");
    if (!Array.isArray(existing)) return;

    if (method === "POST" && !data._method) {
      existing.unshift({ ...data, id: data.id || `temp-${Date.now()}`, offline: true });
      localStorage.setItem(cacheKey, JSON.stringify(existing));
    } else if (data._method === "DELETE" || method === "DELETE") {
      const id = data.id || data._id;
      if (id) {
        const filtered = existing.filter((i: any) => i.id !== id);
        localStorage.setItem(cacheKey, JSON.stringify(filtered));
      }
    } else if (data._method === "PATCH" && data.id) {
      const updated = existing.map((i: any) => i.id === data.id ? { ...i, ...data } : i);
      localStorage.setItem(cacheKey, JSON.stringify(updated));
    }
  } catch {}
}

export async function offlineRequest(url: string, data: any, method: "POST" | "DELETE" | "PUT" | "PATCH" = "POST") {
  // 1. Offline hai to seedha queue me
  if (typeof window !== "undefined" && !navigator.onLine) {
    const queue = getQueue();
    queue.push({ url, method, data, time: Date.now() });
    saveQueue(queue);
    updateCacheForOffline(url, data, method);
    return { ok: true, offline: true, message: "Offline save - net aate hi sync hoga" } as any;
  }

  try {
    let finalUrl = url;
    let finalMethod = method;
    let finalData = data;

    if (data?._method) {
      finalMethod = data._method as any;
      const { _method, ...rest } = data;
      finalData = rest;
      if (finalMethod === "DELETE" && rest.id) {
        finalUrl = `${url}?id=${rest.id}`;
      }
    }

    const isDeleteWithQuery = finalMethod === "DELETE" && finalUrl.includes("?id=");

    const res = await fetch(finalUrl, {
      method: finalMethod,
      headers: { "Content-Type": "application/json" },
      body: isDeleteWithQuery ? undefined : JSON.stringify(finalData),
    });

    if (!res.ok) throw new Error("Server error");
    
    const json = await res.json().catch(() => ({}));
    return { ok: true, offline: false, data: json, json: async () => json } as any;

  } catch (e) {
    // 2. Net fail hua to bhi queue me - yehi aapka 19 pending wala logic hai
    const queue = getQueue();
    queue.push({ url, method, data, time: Date.now() });
    saveQueue(queue);
    updateCacheForOffline(url, data, method);
    return { ok: true, offline: true } as any;
  }
}

export const offlinePost = (url: string, data: any) => offlineRequest(url, data, "POST");
export const offlineDelete = (url: string, data: any) => offlineRequest(url, { ...data, _method: "DELETE" }, "POST");
export const offlinePatch = (url: string, data: any) => offlineRequest(url, { ...data, _method: "PATCH" }, "POST");

// --- SYNC ON ONLINE ---
if (typeof window !== "undefined") {
  let isSyncing = false; // FIX: Double sync se bachao
  
  window.addEventListener("online", async () => {
    if (isSyncing) return;
    const queue = getQueue();
    if (queue.length === 0) return;

    isSyncing = true;
    console.log(`Syncing ${queue.length} offline items...`);
    let success = 0;
    const remaining: QueueItem[] = [];

    for (const item of queue) {
      try {
        let finalUrl = item.url;
        let finalMethod = item.method;
        let finalData = item.data;

        if (finalData?._method) {
          finalMethod = finalData._method as any;
          const { _method, ...rest } = finalData;
          finalData = rest;
          if (finalMethod === "DELETE" && rest.id) {
            finalUrl = `${item.url}?id=${rest.id}`;
          }
        }

        const isDeleteWithQuery = finalMethod === "DELETE" && finalUrl.includes("?id=");

        const res = await fetch(finalUrl, {
          method: finalMethod,
          headers: { "Content-Type": "application/json" },
          body: isDeleteWithQuery ? undefined : JSON.stringify(finalData),
        });
        
        if (res.ok) success++;
        else remaining.push(item);

      } catch {
        remaining.push(item);
      }
    }

    saveQueue(remaining);
    isSyncing = false;
    if (success > 0) {
      console.log(`${success} items synced to Neon`);
      window.dispatchEvent(new Event("offline-sync-done"));
      // Page reload karo taake fresh data aaye
      window.location.reload();
    }
  });
}