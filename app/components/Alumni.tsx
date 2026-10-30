"use client";

export default function Alumni() {
  return (
    <section id="alumni" className="px-4 md:px-20 py-12 md:py-16 bg-[#0d1b34] text-white relative overflow-hidden">
      {/* bg glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center">
          <span className="bg-white/[0.08] border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] text-blue-200">OUR PRIDE</span>
          <h2 className="text-[24px] md:text-[32px] font-black mt-3 tracking-tight">Our Alumni</h2>
          <p className="text-[12px] md:text-[13px] text-white/50 mt-2 max-w-md mx-auto">From Sariab Road to leading positions across Pakistan</p>
        </div>

        <div className="mt-8 bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[20px] md:rounded-[24px] p-6 md:p-8 text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-b from-white to-gray-200 rounded-[16px] flex items-center justify-center text-[24px] md:text-[28px] mx-auto mb-4 shadow-lg shadow-black/20">
            🎓
          </div>
          <h3 className="text-[18px] md:text-xl font-black tracking-tight">Coming Soon</h3>
          <p className="text-[12px] md:text-[13px] text-blue-100/70 mt-2 leading-relaxed max-w-sm mx-auto">
            We are building our Alumni Directory. Soon you will see successful graduates from Govt. General Muhammad Musa College.
          </p>

          <div className="mt-6 flex justify-center gap-2">
            <div className="h-1 w-6 bg-white/20 rounded-full animate-pulse" />
            <div className="h-1 w-1 bg-white/20 rounded-full" />
            <div className="h-1 w-1 bg-white/10 rounded-full" />
          </div>

          <p className="text-[9px] md:text-[10px] text-white/30 mt-5 tracking-[0.25em] uppercase font-bold">Est. 1987 — Work in Progress</p>
        </div>
      </div>
    </section>
  );
}