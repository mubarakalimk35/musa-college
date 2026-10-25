"use client";
import { useState, memo } from "react";

const notices = [
  "Admissions Open 2025-26 for BS Programs - Apply Now",
  "Last Date for Admission Form Submission: 30 May 2025",
  "Entry Test Schedule Announced - Check Downloads Section",
  "Merit List will be displayed on 5th June 2025",
];

const NoticeTicker = memo(function NoticeTicker() {
  const [isPaused, setIsPaused] = useState(false);

  const handleViewAll = () => {
    const el = document.getElementById("news") || document.getElementById("events") || document.getElementById("newsandevents");
    if (el) {
      const headerOffset = 145;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div 
      className="w-full flex items-center h-[50px] bg-[#eef7ff] border-y border-[#dbeafe] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Left - NOTICE */}
      <div className="h-full bg-[#0f2a52] text-white px-6 flex items-center gap-2.5 shrink-0">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
        </span>
        <span className="text-[14px] font-bold tracking-[0.15em]">NOTICE</span>
      </div>

      {/* Center - Marquee */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div 
          className="whitespace-nowrap flex items-center gap-10"
          style={{
            animationName: 'marquee',
            animationDuration: '18s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
          } as React.CSSProperties}
        >
          {[...notices, ...notices].map((notice, i) => (
            <span key={i} className="flex items-center gap-3 text-[15.5px] shrink-0">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0"></span>
              <span className="text-red-600 font-medium">{notice}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right - View All */}
      <div className="h-full flex items-center shrink-0 pl-5 pr-6 bg-[#eef7ff] border-l border-[#dbeafe]">
        <button 
          onClick={handleViewAll} 
          className="text-[13px] font-bold tracking-widest text-[#0f2a52] hover:text-blue-700 flex items-center gap-1.5 cursor-pointer transition"
        >
          VIEW ALL <span className="text-[15px] font-normal">→</span>
        </button>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
});

export default NoticeTicker;