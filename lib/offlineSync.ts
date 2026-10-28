// lib/offlineSync.ts
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
  return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
}

function saveQueue(queue: QueueItem[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export async function offlineRequest(url: string, data: any, method: "POST" | "DELETE" | "PUT" | "PATCH" = "POST") {
  // Offline hai to queue me daal do
  if (typeof window !== "undefined" && !navigator.onLine) {
    const queue = getQueue();
    queue.push({ url, method, data, time: Date.now() });
    saveQueue(queue);

    // Cache update for instant UI
    const cacheKey = CACHE_PREFIX + url.replace("/api/", "");
    try {
      const existing = JSON.parse(localStorage.getItem(cacheKey) || "[]");
      if (method === "POST" && !data._method) {
        existing.unshift({ ...data, id: data.id || `temp-${Date.now()}`, offline: true });
        localStorage.setItem(cacheKey, JSON.stringify(existing));
      }
    } catch {}

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
    
    // Hamesha same shape return karo
    const json = await res.json().catch(() => ({}));
    return { ok: true, offline: false, data: json, json: async () => json } as any;

  } catch (e) {
    // Net fail hua to bhi queue me
    const queue = getQueue();
    queue.push({ url, method, data, time: Date.now() });
    saveQueue(queue);
    return { ok: true, offline: true } as any;
  }
}

export const offlinePost = (url: string, data: any) => offlineRequest(url, data, "POST");
export const offlineDelete = (url: string, data: any) => offlineRequest(url, data, "DELETE");
export const offlinePatch = (url: string, data: any) => offlineRequest(url, data, "PATCH");

if (typeof window !== "undefined") {
  window.addEventListener("online", async () => {
    const queue = getQueue();
    if (queue.length === 0) return;

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
    if (success > 0) {
      console.log(`${success} items synced to Neon`);
      window.dispatchEvent(new Event("offline-sync-done"));
    }
  });
}