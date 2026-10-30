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
    setMobileMenu(false);
    if (id === 'about') return router.push('/about');
    if (id === 'downloads') return router.push('/downloads');
    if (id === 'gallery') return router.push('/gallery');
    if (id === 'faculty') return router.push('/faculty');
    if (id === 'home') {
      if (pathname !== '/') return router.push('/');
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const doScroll = () => {
      const el = document.getElementById(id) || document.getElementById('newsandevents');
      if (el) {
        const offset = el.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    };

    if (pathname !== '/') {
      router.push(`/#${id}`);
      setTimeout(doScroll, 600);
    } else {
      doScroll();
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full">
      {/* 1. NAVBAR - top 0 */}
      <div className="bg-white shadow-sm relative z-[101]">
        <Navbar scrollTo={scrollTo} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} setShowForm={goToApply} />
      </div>

      {/* 2. TICKER - navbar ke neeche chipka, har page pe */}
      <div className="bg-[#eef7ff] relative z-[100] border-b">
        <NoticeTicker />
      </div>
    </header>
  );
}