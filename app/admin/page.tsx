"use client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const cards = [
    { title: "Admission List", icon: "🎓", color: "bg-blue-600", href: "/admin/admissions" },
    { title: "News and Events", icon: "📰", color: "bg-green-600", href: "/admin/news" },
    { title: "Faculty", icon: "👨‍🏫", color: "bg-purple-600", href: "/admin/faculty" },
    { title: "Downloads", icon: "📁", color: "bg-orange-500", href: "/admin/downloads" },
    { title: "Gallery", icon: "🖼️", color: "bg-pink-500", href: "/admin/gallery" },
    { title: "Alumni", icon: "🎥", color: "bg-indigo-600", href: "/admin/alumni" },
    { title: "Contact", icon: "📩", color: "bg-teal-600", href: "/admin/contact" },
    { title: "Home", icon: "🏠", color: "bg-slate-800", href: "/admin/home" }, // <-- YE SAB SE IMPORTANT HAI
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="bg-white border rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Govt. General Muhammad Musa College</p>
        </div>
        <button onClick={() => { localStorage.removeItem("isAdminLoggedIn"); router.push("/admin/login") }} className="bg-red-50 text-red-600 px-6 py-2 rounded-lg font-bold">Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-white border rounded-2xl p-6 hover:shadow-lg transition cursor-pointer" onClick={() => router.push(card.href)}>
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center text-white text-xl`}>
              <span>{card.icon}</span>
            </div>
            <h3 className="font-bold mt-4">{card.title}</h3>
            <p className="text-blue-600 text-xs font-bold mt-2">Manage →</p>
          </div>
        ))}
      </div>
    </div>
  );
}