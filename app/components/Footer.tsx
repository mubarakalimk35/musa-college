"use client";
import { useState } from "react";

export default function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer className="text-center py-5 md:py-6 bg-[#0d1b34] text-white text-[12px] md:text-sm px-4">
        <p className="font-black tracking-wide">© 2026 Govt. General Muhammad Musa Postgraduate College Quetta</p>
        
        <p className="mt-2 md:mt-3 text-[12px] md:text-[14px] font-medium tracking-wide text-white/70">
          Designed & Developed by{" "}
          <button 
            onClick={() => setOpen(true)}
            className="font-black text-white text-[13px] md:text-[15px] underline decoration-white/30 underline-offset-4 hover:decoration-white transition cursor-pointer"
          >
            Mubarak Ali
          </button>
        </p>
      </footer>

      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4">
          {/* backdrop close */}
          <div onClick={() => setOpen(false)} className="absolute inset-0" />
          
          <div className="bg-white rounded-[20px] max-w-[340px] w-full p-5 md:p-6 relative shadow-2xl animate-[pop_0.2s_ease]">
            <button 
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 active:scale-95 transition text-[14px] font-black"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0d1b34] rounded-full flex items-center justify-center text-white text-[18px] md:text-[22px] font-black mx-auto mb-3 shadow">
                MA
              </div>
              <h2 className="text-[18px] md:text-xl font-black text-black">Mubarak Ali</h2>
              <p className="text-[11px] md:text-[12px] font-bold text-gray-500 mt-1">Computer Science Student</p>
              <p className="text-[10px] md:text-[11px] text-gray-400">Govt. General Muhammad Musa College Quetta</p>

              <div className="mt-4 bg-[#f8fafc] border border-gray-100 rounded-xl p-3 text-left space-y-1.5">
                <p className="text-[11px] md:text-[12px]"><span className="font-black">Role:</span> Full Stack Developer</p>
                <p className="text-[11px] md:text-[12px]"><span className="font-black">Project:</span> College Management System</p>
                <p className="text-[11px] md:text-[12px]"><span className="font-black">Contact:</span> 03400809764</p>
              </div>

              <div className="mt-4 flex gap-2">
                <a href="https://wa.me/923400809764" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white py-2.5 rounded-xl text-[11px] md:text-[12px] font-black text-center hover:opacity-90 active:scale-[0.98] transition">
                  WhatsApp
                </a>
                <a href="tel:03400809764" className="flex-1 bg-black text-white py-2.5 rounded-xl text-[11px] md:text-[12px] font-black text-center hover:bg-zinc-800 active:scale-[0.98] transition">
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes pop { 0%{ transform: scale(0.96); opacity:0 } 100%{ transform: scale(1); opacity:1 } }`}</style>
    </>
  );
}