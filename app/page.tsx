"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Programs from "./components/Programs";
import NewsAndEvents from "./components/NewsAndEvents";
import PrincipalMessage from "./components/PrincipalMessage";
import FacultySection from "./components/FacultySection";
import FacultyModal from "./components/FacultyModal";
import Downloads from "./components/Downloads";
import Gallery from "./components/Gallery";
import Alumni from "./components/Alumni";
import NoticeTicker from "./components/NoticeTicker";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdmissionForm from "./components/AdmissionForm";

const images = ["/hero1.jpeg", "/hero2.jpeg", "/hero3.jpeg", "/hero4.jpeg", "/hero5.jpeg"];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cnic, setCnic] = useState("");
  const [cnicError, setCnicError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => { setCurrent((prev) => (prev + 1) % images.length); }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showForm || selectedFaculty) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [showForm, selectedFaculty]);

  const handleCnicChange = (e: any) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 13) { setCnic(value); setCnicError(value.length > 0 && value.length !== 13 ? "CNIC must be exactly 13 digits without dashes" : ""); }
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (cnic.length !== 13) { setCnicError("CNIC must be exactly 13 digits"); return; }
    setSubmitted(true); setTimeout(() => { setShowForm(false); setSubmitted(false); setCnic(""); }, 3000);
  };
  
  const scrollTo = (id: string) => {
    if (id === 'about') {
      router.push('/about');
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
        .form-input{ background:#fff !important; color:#000 !important; -webkit-text-fill-color:#000 !important; }
        .form-input::placeholder{ color:#9ca3af !important; -webkit-text-fill-color:#9ca3af !important; }
      `}</style>

      <Navbar scrollTo={scrollTo} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu} setShowForm={setShowForm} />
      <div className="sticky top-[88px] md:top-[96px] z-40">
        <NoticeTicker />
      </div>
      <Hero images={images} current={current} setShowForm={setShowForm} scrollTo={scrollTo} />
      <Stats />
      <Programs />
      <NewsAndEvents />
      <PrincipalMessage />
      <FacultySection setSelectedFaculty={setSelectedFaculty} />
      <FacultyModal selectedFaculty={selectedFaculty} setSelectedFaculty={setSelectedFaculty} />
      <Downloads />
      <Gallery />
      <Alumni />
      <Contact />
      <Footer />
      <AdmissionForm showForm={showForm} setShowForm={setShowForm} submitted={submitted} cnic={cnic} cnicError={cnicError} handleCnicChange={handleCnicChange} handleSubmit={handleSubmit} />

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