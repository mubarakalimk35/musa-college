"use client";
import { useState } from "react";

export default function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer className="text-center py-6 bg-[#0d1b34] text-white text-sm">
        <p className="font-bold">© 2026 Govt. General Muhammad Musa Postgraduate College Quetta</p>
        
        <p className="mt-3 text-[14px] md:text-[15px] font-medium tracking-wide text-white/80">
          Designed & Developed by{" "}
          <button 
            onClick={() => setOpen(true)}
            className="font-black text-white text-[15px] md:text-[16px] underline decoration-white/40 underline-offset-4 hover:text-white hover:decoration-white transition cursor-pointer"
          >
            Mubarak Ali
          </button>
        </p>
      </footer>

      {/* --- Developer Info Popup --- */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative shadow-2xl">
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#0d1b34] rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto mb-4">
                MA
              </div>
              <h2 className="text-xl font-black text-black">Mubarak Ali</h2>
              <p className="text-[12px] font-bold text-gray-500 mt-1">Computer Science Student</p>
              <p className="text-[11px] text-gray-400">Govt. General Muhammad Musa College Quetta</p>

              <div className="mt-5 bg-[#f8fafc] rounded-xl p-3 text-left space-y-2">
                <p className="text-[12px]"><span className="font-bold">Role:</span> Full Stack Developer</p>
                <p className="text-[12px]"><span className="font-bold">Project:</span> College Management System</p>
                <p className="text-[12px]"><span className="font-bold">Contact:</span> 03400809764</p>
              </div>

              <div className="mt-5 flex gap-2">
                <a href="https://wa.me/923400809764" target="_blank" className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-[12px] font-bold text-center">
                  WhatsApp
                </a>
                <a href="tel:03400809764" className="flex-1 bg-black text-white py-2.5 rounded-xl text-[12px] font-bold text-center">
                  Call
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}