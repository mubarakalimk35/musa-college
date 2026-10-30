// Secure + Performance optimized
export async function cachedFetch<T = any>(
  key: string, 
  url: string, 
  setter: (data: T[]) => void, 
  setLoading?: (b: boolean) => void
) {
  const isValidArray = (v: any) => Array.isArray(v) && v.length <= 1000; // DoS protection
  
  try {
    const res = await fetch(url, { 
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || data.news || data.faculty || [];

    // Validation - sirf valid array hi cache karo
    if (!isValidArray(list) && list.length !== 0) {
      throw new Error("Invalid data format");
    }

    setter(list as T[]);

    // Mobile-safe: localStorage ko try-catch me aur async jaisa
    try {
      // Quota check
      const str = JSON.stringify(list);
      if (str.length > 4 * 1024 * 1024) { // 4MB se zyada ho to cache mat karo
        console.warn(`Cache too large for ${key}, skipping`);
        return;
      }
      // requestIdleCallback se main thread block nahi hoga - mobile smooth
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          try { localStorage.setItem(key, str); } catch {}
        });
      } else {
        localStorage.setItem(key, str);
      }
    } catch (e: any) {
      if (e?.name === 'QuotaExceededError') {
        localStorage.removeItem(key); // purana cache clear
      }
    }

  } catch {
    // Offline - cache se lao
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return;
      const parsed = JSON.parse(cached);
      if (isValidArray(parsed) || parsed.length === 0) {
        setter(parsed);
      }
    } catch {
      // Corrupt cache ho to delete kardo
      try { localStorage.removeItem(key); } catch {}
    }
  } finally {
    if (setLoading) setLoading(false);
  }
}