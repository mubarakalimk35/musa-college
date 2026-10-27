"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function NoticeTicker() {
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const notices = [
    "Admissions Open 2025-26 for BS Programs — Apply Now",
    "Last Date for Form Submission: 30 May 2025",
    "Entry Test Schedule Announced",
    "Merit List will be displayed on 5th June 2025",
  ];

  const goToNews = () => {
    const possibleIds = ["newsandevents", "news", "news-events"];
    const doScroll = () => {
      for (const id of possibleIds) {
        const el = document.getElementById(id);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 140;
          window.scrollTo({ top: y, behavior: "smooth" });
          return true;
        }
      }
      return false;
    };
    if (pathname !== "/") {
      router.push("/#newsandevents");
      setTimeout(() => doScroll(), 700);
    } else {
      doScroll();
    }
  };

  return (
    <div className="w-full bg-white border-y border-slate-200 shadow-sm">
      <div
        className="flex items-center h-[58px] md:h-[62px] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex items-center gap-2.5 px-5 md:px-6 h-full bg-slate-50 border-r border-slate-200 shrink-0">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[13px] md:text-[14px] font-bold tracking-widest text-slate-800">NOTICE</span>
        </div>

        <div className="flex-1 overflow-hidden h-full flex items-center bg-white">
          <div
            className="flex items-center whitespace-nowrap"
            style={{
              animation: `marquee 40s linear infinite`,
              animationPlayState: isPaused ? "paused" : "running",
            } as React.CSSProperties}
          >
            {[...notices, ...notices, ...notices].map((t, i) => (
              <span key={i} className="px-8 text-[15px] md:text-[16px] text-[#8B0000] font-semibold flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#8B0000] rounded-full"></span> {t}
              </span>
            ))}
          </div>
        </div>

        <div className="pr-3 pl-3 border-l border-slate-100 shrink-0 h-full flex items-center bg-white">
          <button
            onClick={goToNews}
            className="cursor-pointer px-5 py-2.5 rounded-full bg-[#0f2a52] text-white text-[12px] md:text-[13px] font-bold tracking-wider hover:bg-black active:scale-95 transition-all flex items-center gap-1.5 shadow"
          >
            VIEW ALL <span className="text-[13px]">→</span>
          </button>
        </div>
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
    </div>
  );
}