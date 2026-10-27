"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "./Navbar";
import NoticeTicker from "./NoticeTicker";

export default function LayoutHeader() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const goToApply = () => router.push('/apply');

  const scrollTo = (id: string) => {
    if (id === 'about') { router.push('/about'); setMobileMenu(false); return; }
    if (id === 'downloads') { router.push('/downloads'); setMobileMenu(false); return; }
    if (id === 'gallery') { router.push('/gallery'); setMobileMenu(false); return; }
    if (id === 'faculty') { router.push('/faculty'); setMobileMenu(false); return; }
    if (id === 'home') {
      if (pathname !== '/') router.push('/');
      else window.scrollTo({ top: 0, behavior: "smooth" });
      setMobileMenu(false);
      return;
    }

    if (pathname !== '/') {
      router.push(`/#${id}`);
      setMobileMenu(false);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const offset = el.getBoundingClientRect().top + window.pageYOffset - 145;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      }, 500);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const offset = el.getBoundingClientRect().top + window.pageYOffset - 145;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
      setMobileMenu(false);
    }
  };

  return (
    <>
      {/* 1. NAVBAR UPAR */}
      <div className="sticky top-0 z-[100] bg-white shadow-sm">
        <Navbar scrollTo={scrollTo} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} setShowForm={goToApply} />
      </div>

      {/* 2. BREAKING TICKER NAVBAR KE NICHE - HAR PAGE PAR */}
      <div className="sticky top-[88px] md:top-[96px] z-[99] bg-[#eef7ff]">
        <NoticeTicker />
      </div>
    </>
  );
}