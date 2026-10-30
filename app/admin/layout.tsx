"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (pathname !== "/admin/login") {
      if (localStorage.getItem("isAdminLoggedIn") !== "true") {
        router.replace("/admin/login");
        return;
      }
    }
    setAuthChecked(true);
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <nav className="flex justify-between items-center px-4 md:px-8 py-2 shadow-md sticky top-0 bg-white z-40 border-b">
        <div className="flex items-center gap-3 cursor-pointer" onClick={()=>router.push("/admin")}>
          <img src="/logo.png" className="h-[64px] w-[64px] object-contain" alt="Logo" />
          <div className="leading-tight">
            <h1 className="text-[16px] font-black text-[#001f4d] uppercase">GOVT. GENERAL MUHAMMAD MUSA</h1>
            <p className="text-[12px] font-extrabold text-[#001f4d] uppercase">POSTGRADUATE COLLEGE QUETTA</p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={() => router.push("/admin")} className="font-bold text-[13px] bg-gray-100 px-4 py-2 rounded-full">Dashboard</button>
          <button onClick={() => router.push("/")} className="font-bold text-[13px] bg-white border px-4 py-2 rounded-full">View Site</button>
          <button onClick={() => {localStorage.removeItem("isAdminLoggedIn"); localStorage.removeItem("adminLoginTime"); router.replace("/admin/login")}} className="bg-red-600 text-white px-5 py-2 rounded-full font-bold text-[13px]">Logout</button>
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