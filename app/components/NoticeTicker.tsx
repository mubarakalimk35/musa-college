"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function NoticeTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fallbackNotices = [
    "Admissions Open 2025-26 for BS Programs — Apply Now",
    "Last Date for Form Submission: 30 May 2025",
    "Entry Test Schedule Announced",
    "Merit List will be displayed on 5th June 2025",
  ];

  const [notices, setNotices] = useState<string[]>(fallbackNotices);

  useEffect(() => {
    fetch("/api/news", { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : d.news || d.data || [];
        if (list.length > 0) {
          const tickerItems = list.filter((n: any) => n.isTicker === true);
          const finalList = tickerItems.length > 0 ? tickerItems : list;
          const titles = finalList.map((n: any) => n.title).filter(Boolean).slice(0, 20);
          if (titles.length > 0) setNotices(titles);
        }
      })
      .catch(() => {});
  }, []);

  const goToNews = () => {
    const possibleIds = ["newsandevents", "news", "news-events"];
    const doScroll = () => {
      for (const id of possibleIds) {
        const el = document.getElementById(id);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 120;
          window.scrollTo({ top: y, behavior: "smooth" });
          return true;
        }
      }
      return false;
    };
    if (pathname !== "/") {
      router.push("/#newsandevents");
      setTimeout(() => doScroll(), 600);
    } else {
      doScroll();
    }
  };

  return (
    <div className="w-full bg-white border-y border-slate-200 shadow-sm sticky top-0 md:top-0 z-30">
      <div
        className="flex items-center h-[48px] md:h-[52px] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="flex items-center gap-2 px-4 md:px-5 h-full bg-slate-50 border-r border-slate-200 shrink-0">
          <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
          <span className="text-[11px] md:text-[13px] font-black tracking-widest text-slate-800">NOTICE</span>
        </div>

        <div className="flex-1 overflow-hidden h-full flex items-center bg-white">
          <div
            className="flex items-center whitespace-nowrap will-change-transform"
            style={{
              animation: `marquee ${Math.max(20, notices.length * 5)}s linear infinite`,
              animationPlayState: isPaused ? "paused" : "running",
            } as React.CSSProperties}
          >
            {[...notices, ...notices].map((t, i) => (
              <span key={i} className="px-6 md:px-8 text-[13px] md:text-[14px] text-[#8B0000] font-bold flex items-center gap-2.5 shrink-0">
                <span className="w-1.5 h-1.5 bg-[#8B0000] rounded-full shrink-0"></span> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="pr-2 md:pr-3 pl-2 md:pl-3 border-l border-slate-100 shrink-0 h-full flex items-center bg-white">
          <button
            onClick={goToNews}
            className="cursor-pointer px-3 md:px-5 py-2 md:py-2 rounded-full bg-[#0f2a52] text-white text-[10px] md:text-[12px] font-black tracking-wider hover:bg-black active:scale-95 transition-all flex items-center gap-1 shadow"
          >
            VIEW ALL <span className="text-[12px]">→</span>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        @media (prefers-reduced-motion: reduce) { div[style*="marquee"] { animation: none !important; overflow-x: auto; } }
      `}</style>
    </div>
  );
}