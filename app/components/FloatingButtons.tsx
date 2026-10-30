"use client";
import Link from "next/link";

export default function FloatingButtons() {
  const whatsappNumber = "923400809764"; // Musa College official
  const facebookPage = "https://www.facebook.com/musacollege";
  const message = "Assalam-o-Alaikum, Musa College admission ke bare me maloomat chahiye.";

  return (
    <>
      {/* WhatsApp - Neeche */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed z-[9999] right-3 md:right-5 bottom-[calc(16px+env(safe-area-inset-bottom))] md:bottom-5 w-[52px] h-[52px] md:w-[56px] md:h-[56px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-transform"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white" className="shrink-0"><path d="M19.11 4.93C17.06 2.88 14.31 1.77 11.38 1.77c-6.03 0-10.94 4.91-10.94 10.94 0 1.93.5 3.81 1.46 5.47L.08 23.93l5.9-1.55c1.58.86 3.36 1.32 5.19 1.32h.01c6.03 0 10.94-4.91 10.94-10.94 0-2.92-1.14-5.67-3.21-7.74l.2.01zM11.39 21.3h-.01c-1.62 0-3.21-.43-4.59-1.25l-.33-.2-3.5.92.93-3.41-.22-.35c-.9-1.43-1.37-3.09-1.37-4.8 0-4.97 4.04-9.01 9.01-9.01 2.41 0 4.67.94 6.37 2.64 1.7 1.7 2.63 3.96 2.63 6.37 0 4.97-4.04 9.01-9.02 9.01l.1-.22zm5.13-6.74c-.28-.14-1.65-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.28-.72.9-.88 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.39-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.1-.18.05-.35-.02-.48-.08-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.35-.25.28-.96.94-.96 2.29s.99 2.66 1.13 2.84c.14.18 1.95 2.98 4.73 4.18.66.28 1.18.45 1.58.58.66.21 1.27.18 1.74.11.53-.08 1.65-.68 1.88-1.33.23-.65.23-1.21.16-1.33-.07-.12-.25-.18-.53-.32z"/></svg>
      </a>

      {/* Facebook - Upar */}
      <Link 
        href={facebookPage} 
        target="_blank" 
        aria-label="Facebook"
        className="fixed z-[9999] right-3 md:right-5 bottom-[calc(76px+env(safe-area-inset-bottom))] md:bottom-[88px] w-[52px] h-[52px] md:w-[56px] md:h-[56px] rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-transform font-black text-[24px]"
      >
        f
      </Link>
    </>
  );
}