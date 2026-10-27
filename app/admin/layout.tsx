"use client";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* YAHI WALA COLLEGE NAVBAR - ADMIN KE LIYE */}
      <nav className="flex justify-between items-center px-4 md:px-10 py-1.5 shadow-md sticky top-0 bg-white z-50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={()=>router.push("/admin")}>
          <img src="/logo.png" className="h-20 w-20 md:h-[85px] md:w-[85px] object-contain" alt="Logo" onError={(e:any)=>{e.target.style.display='none'}} />
          <div className="leading-tight text-justify">
            <h1 className="text-[16px] md:text-[22px] font-black text-[#001f4d] uppercase leading-[0.9] tracking-wide">GOVT. GENERAL MUHAMMAD MUSA</h1>
            <p className="text-[12px] md:text-[15px] font-extrabold text-[#001f4d] uppercase mt-1 tracking-wider">POSTGRADUATE COLLEGE QUETTA</p>
            <p className="text-[10px] font-bold text-red-600 tracking-[0.2em] mt-1">ADMIN PANEL</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-3 items-center">
          <button onClick={() => router.push("/admin")} className="font-bold text-[14px] bg-gray-100 px-5 py-2.5 rounded-lg hover:bg-gray-200">Dashboard</button>
          <button onClick={() => router.push("/")} className="font-bold text-[14px] bg-white border px-5 py-2.5 rounded-lg hover:bg-gray-50">View Site</button>
          <button onClick={() => {localStorage.removeItem("isAdminLoggedIn"); router.push("/admin/login")}} className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-[14px]">Logout</button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden gap-2 items-center">
          <button onClick={() => router.push("/admin")} className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-[12px]">Dashboard</button>
          <button onClick={() => {localStorage.removeItem("isAdminLoggedIn"); router.push("/admin/login")}} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-[12px]">Logout</button>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}