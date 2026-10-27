"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Programs from "./components/Programs";
import NewsAndEvents from "./components/NewsAndEvents";
import PrincipalMessage from "./components/PrincipalMessage";
import Alumni from "./components/Alumni";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const images = ["/hero1.jpeg", "/hero2.jpeg", "/hero3.jpeg", "/hero4.jpeg", "/hero5.jpeg"];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const router = useRouter();

  const goToApply = () => {
    router.push('/apply');
  };

  useEffect(() => {
    const timer = setInterval(() => { setCurrent((prev) => (prev + 1) % images.length); }, 3000);
    return () => clearInterval(timer);
  }, []);
  
  const scrollTo = (id: string) => {
    if (id === 'about') {
      router.push('/about');
      setMobileMenu(false);
      return;
    }
    if (id === 'downloads') {
      router.push('/downloads');
      setMobileMenu(false);
      return;
    }
    if (id === 'gallery') {
      router.push('/gallery');
      setMobileMenu(false);
      return;
    }
    if (id === 'faculty') {
      router.push('/faculty');
      setMobileMenu(false);
      return;
    }
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMobileMenu(false);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 145;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setMobileMenu(false);
  };

  const whatsappNumber = "923400809764";
  const defaultMsg = "Assalam-o-Alaikum, Main Govt. General Muhammad Musa Postgraduate College me admission ke bare me maloomat lena chahta hun. Please guide karen.";

  return (
    <main className="min-h-screen bg-white">
      <style>{`
        @media (max-width: 768px) {
          .mobile-black{ color:#000 !important; -webkit-text-fill-color:#000 !important; opacity:1 !important; }
        }
      `}</style>

      <Hero images={images} current={current} setShowForm={goToApply} scrollTo={scrollTo} />
      <Stats />
      <Programs />
      <NewsAndEvents />
      <PrincipalMessage />
      <Alumni />
      <Contact />
      <Footer />

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMsg)}`}
        target="_blank"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
          <path d="M19.11 4.93C17.06 2.88 14.31 1.77 11.38 1.77c-6.03 0-10.94 4.91-10.94 10.94 0 1.93.5 3.81 1.46 5.47L0 24l5.9-1.55c1.58.86 3.36 1.32 5.19 1.32h.01c6.03 0 10.94-4.91 10.94-10.94 0-2.92-1.14-5.67-3.21-7.74zM11.39 21.3h-.01c-1.62 0-3.21-.43-4.59-1.25l-.33-.2-3.5.92.93-3.41-.22-.35c-.9-1.43-1.37-3.09-1.37-4.8 0-4.97 4.04-9.01 9.01-9.01 2.41 0 4.67.94 6.37 2.64 1.7 1.7 2.63 3.96 2.63 6.37 0 4.97-4.04 9.01-9.02 9.01zM16.52 14.56c-.28-.14-1.65-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.28-.72.9-.88 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.39-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.1-.18.05-.35-.02-.48-.08-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.35-.25.28-.96.94-.96 2.29s.99 2.66 1.13 2.84c.14.18 1.95 2.98 4.73 4.18.66.28 1.18.45 1.58.58.66.21 1.27.18 1.74.11.53-.08 1.65-.68 1.88-1.33.23-.65.23-1.21.16-1.33-.07-.12-.25-.18-.53-.32z"/>
        </svg>
      </a>

      {/* Facebook */}
      <a
        href="https://www.facebook.com/musacollege"
        target="_blank"
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '60px',
          height: '60px',
          backgroundColor: '#1877F2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold',
          textDecoration: 'none'
        }}
      >
        f
      </a>
    </main>
  );
}