"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const options = [
  { title: "Admission List", icon: "🎓", href: "/admin/admissions", color: "bg-blue-600" },
  { title: "News and Events", icon: "📰", href: "/admin/news", color: "bg-emerald-600" },
  { title: "Faculty", icon: "👨‍🏫", href: "/admin/faculty", color: "bg-violet-600" },
  { title: "Downloads", icon: "📁", href: "/admin/downloads", color: "bg-orange-500" },
  { title: "Gallery", icon: "🖼️", href: "/admin/gallery", color: "bg-pink-500" },
  { title: "Alumni", icon: "👥", href: "/admin/alumni", color: "bg-indigo-600" },
  { title: "Contact", icon: "📩", href: "/admin/contact", color: "bg-teal-600" },
  { title: "Home", icon: "🏠", href: "/", color: "bg-slate-800" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("isAdminLoggedIn") !== "true") {
      router.push("/admin/login");
    } else setOk(true);
  }, [router]);

  if (!ok) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border mb-8">
          <div><h1 className="text-3xl font-bold">Admin Dashboard</h1><p className="text-gray-500">Govt. General Muhammad Musa College</p></div>
          <button onClick={()=>{localStorage.removeItem("isAdminLoggedIn"); router.push("/admin/login")}} className="bg-red-50 text-red-600 px-5 py-2 rounded-xl font-bold">Logout</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map(o=>(
            <div key={o.title} onClick={()=>router.push(o.href)} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all">
              <div className={`w-14 h-14 ${o.color} rounded-xl flex items-center justify-center text-2xl text-white`}>{o.icon}</div>
              <h3 className="font-bold mt-4 text-lg">{o.title}</h3>
              <p className="text-blue-600 text-sm font-semibold mt-2">Manage →</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}