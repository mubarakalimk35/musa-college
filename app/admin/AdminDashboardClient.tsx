"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboardClient() {
  const [count, setCount] = useState({ admissions: 0, news: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCounts() {
      try {
        const [admRes, newsRes] = await Promise.all([
          fetch("/api/admissions", { signal: controller.signal }),
          fetch("/api/news", { signal: controller.signal })
        ]);
        const admData = await admRes.json().catch(()=> ({}));
        const newsData = await newsRes.json().catch(()=> ({}));
        
        setCount({
          admissions: Array.isArray(admData) ? admData.length : (admData.count || 0),
          news: Array.isArray(newsData) ? newsData.length : (newsData.news?.length || 0)
        });
      } catch (e: any) {
        if (e.name !== "AbortError") console.log("count error");
      } finally {
        setLoading(false);
      }
    }
    loadCounts();
    return () => controller.abort();
  }, []);

  const cards = [
    { title: "Admission List", desc: loading ? "loading..." : `${count.admissions} applications`, icon: "🎓", color: "bg-[#0d2a54]", light: "bg-blue-50", href: "/admin/admissions" },
    { title: "News and Events", desc: loading ? "loading..." : `${count.news} items`, icon: "📰", color: "bg-emerald-600", light: "bg-emerald-50", href: "/admin/news" },
    { title: "Faculty", desc: "Manage teachers", icon: "👨‍🏫", color: "bg-violet-600", light: "bg-violet-50", href: "/admin/faculty" },
    { title: "Downloads", desc: "Forms & docs", icon: "📁", color: "bg-orange-500", light: "bg-orange-50", href: "/admin/downloads" },
    { title: "Gallery", desc: "College photos", icon: "🖼️", color: "bg-pink-500", light: "bg-pink-50", href: "/admin/gallery" },
    { title: "Alumni", desc: "Coming soon", icon: "🎓", color: "bg-indigo-600", light: "bg-indigo-50", href: "/admin/alumni" },
    { title: "Contact", desc: "Messages", icon: "📩", color: "bg-teal-600", light: "bg-teal-50", href: "/admin/contact" },
    { title: "Home Content", desc: "Hero & stats", icon: "🏠", color: "bg-slate-800", light: "bg-slate-100", href: "/admin/home" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-[20px] p-5 md:p-6 flex items-center shadow-[0_8px_24px_rgba(0,0,0,0.04)] gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* FIXED: Admin Dashboard ka icon */}
            <div className="w-11 h-11 bg-[#0d2a54] rounded-xl flex items-center justify-center text-white text-[20px] shrink-0 shadow">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-[18px] md:text-2xl font-black tracking-tight leading-none truncate">Admin Dashboard</h1>
              {/* FIXED: Postgraduate added */}
              <p className="text-[11px] md:text-[13px] text-gray-500 font-medium mt-1 truncate">Govt. General Muhammad Musa Postgraduate College • Quetta</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mt-6">
          {cards.map((card) => (
            <Link key={card.title} href={card.href} className="bg-white border border-gray-100 rounded-[18px] md:rounded-2xl p-4 md:p-6 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-black/10 hover:-translate-y-1 transition-all cursor-pointer group block">
              <div className={`w-11 h-11 md:w-12 md:h-12 ${card.color} rounded-[12px] md:rounded-xl flex items-center justify-center text-white text-[18px] md:text-xl shadow-lg group-active:scale-95 transition`}>
                <span>{card.icon}</span>
              </div>
              <h3 className="font-black mt-4 text-[13px] md:text-[15px] tracking-tight text-black">{card.title}</h3>
              <p className="text-[11px] text-gray-400 font-medium mt-1">{card.desc}</p>
              <p className={`text-[11px] font-black mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${card.light} text-black/60`}>Manage <span className="group-hover:translate-x-0.5 transition">→</span></p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}