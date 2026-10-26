"use client";

export default function NoticeTicker() {
  return (
    <div className="bg-[#0d2a54] text-white py-2.5 flex items-center gap-3 overflow-hidden shadow">
      <span className="bg-red-600 text-white text-[11px] font-black px-4 py-1 rounded-full shrink-0 animate-pulse ml-3">
        BREAKING
      </span>
      <div className="flex-1 overflow-hidden">
        <p className="text-white text-[13px] font-bold whitespace-nowrap animate-[marquee_25s_linear_infinite]">
          Admission Open for BS Programs 2025-26 | Annual Sports Week starting 20th Oct | Exam Date Sheet Announced | College Timing 8:00 AM - 2:00 PM | BS Admissions 2025 Last Date 30th Oct
        </p>
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
    </div>
  );
}