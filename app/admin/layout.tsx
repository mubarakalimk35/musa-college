"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (pathname !== "/admin/login") {
      if (localStorage.getItem("isAdminLoggedIn") !== "true") {
        router.replace("/admin/login");
        return;
      }
    }
    setAuthChecked(true);

    setIsOnline(navigator.onLine);
    const updateCount = () => {
      try {
        const q = JSON.parse(localStorage.getItem("offline_queue") || "[]");
        setPendingCount(q.length);
      } catch { setPendingCount(0); }
    };
    updateCount();

    const handleOnline = async () => {
      setIsOnline(true);
      const raw = localStorage.getItem("offline_queue");
      const queue = raw ? JSON.parse(raw) : [];
      if (queue.length === 0) return;

      setIsSyncing(true);
      let success = 0;
      for (const item of queue) {
        try {
          const res = await fetch(item.url, {
            method: item.data?._method === "DELETE" ? "DELETE" : item.data?._method === "PATCH" ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item.data),
          });
          if (res.ok) success++;
        } catch {}
      }
      // FIX: Chahe success ho ya fail - queue clear karo warna 19 ka loop chalta rahega
      localStorage.removeItem("offline_queue");
      setPendingCount(0);
      setIsSyncing(false);
      window.dispatchEvent(new Event("offline-synced"));
    };
    
    const handleOffline = () => setIsOnline(false);

    // FIX: Page load par hi check karo, online event ka wait mat karo
    if (navigator.onLine) {
      handleOnline();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("storage", updateCount);
    
    const interval = setInterval(updateCount, 3000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("storage", updateCount);
      clearInterval(interval);
    };
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="sticky top-0 z-[100] w-full">
        {!isOnline && (
          <div className="bg-yellow-500 text-black text-center py-1.5 text-[11px] font-black tracking-wider">
            ⚠️ Offline Mode - {pendingCount > 0 ? `${pendingCount} queued • ` : ""}Net aate hi auto sync
          </div>
        )}
        {/* FIX: Sirf tab dikhao jab sach me sync ho raha ho */}
        {isOnline && isSyncing && (
          <div className="bg-green-600 text-white text-center py-1.5 text-[11px] font-black tracking-wider animate-pulse">
            🔄 Syncing {pendingCount} pending...
          </div>
        )}
      </div>

      <nav className="flex justify-between items-center px-4 md:px-8 py-2 shadow-md sticky top-0 bg-white z-40 border-b">
        <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={()=>router.push("/admin")}>
          <img src="/logo.png" className="h-12 w-12 md:h-[64px] md:w-[64px] object-contain shrink-0" alt="Logo" onError={(e: any)=>{e.target.style.display='none'}} />
          <div className="leading-tight min-w-0">
            <h1 className="text-[12px] md:text-[16px] font-black text-[#001f4d] uppercase leading-[0.9] truncate">GOVT. GENERAL MUHAMMAD MUSA</h1>
            <p className="text-[10px] md:text-[12px] font-extrabold text-[#001f4d] uppercase mt-0.5 tracking-wider truncate">POSTGRADUATE COLLEGE QUETTA</p>
            <p className="text-[9px] font-bold text-red-600 tracking-[0.15em] mt-0.5">ADMIN • {isOnline ? "● Online" : "● Offline"} {pendingCount > 0 && !isSyncing ? `(${pendingCount})` : ""}</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-2 items-center shrink-0">
          <button onClick={() => router.push("/admin")} className="font-bold text-[13px] bg-gray-100 px-4 py-2 rounded-full">Dashboard</button>
          <button onClick={() => router.push("/")} className="font-bold text-[13px] bg-white border px-4 py-2 rounded-full">View Site</button>
          <button onClick={() => {localStorage.removeItem("isAdminLoggedIn"); localStorage.removeItem("adminLoginTime"); router.replace("/admin/login")}} className="bg-red-600 text-white px-5 py-2 rounded-full font-bold text-[13px]">Logout</button>
        </div>

        <div className="flex md:hidden gap-1.5 items-center shrink-0">
          <button onClick={() => router.push("/admin")} className="bg-gray-100 px-3 py-2 rounded-full font-black text-[11px]">Home</button>
          <button onClick={() => {localStorage.removeItem("isAdminLoggedIn"); localStorage.removeItem("adminLoginTime"); router.replace("/admin/login")}} className="bg-red-600 text-white px-3 py-2 rounded-full font-black text-[11px]">Out</button>
        </div>
      </nav>

      <main>
        {!authChecked ? (
          <div className="min-h-[60vh] flex items-center justify-center"><div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}