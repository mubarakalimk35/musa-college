"use client";
import { useState, useEffect } from "react";

export default function Contact() {
  const [contact, setContact] = useState({
    address: "Gulistan Town, Quetta, Balochistan",
    phone: "081-2669085",
    email: "mubarakali.mk.35@gmail.com",
    mapUrl: "https://www.google.com/maps?q=Govt+General+Muhammad+Musa+Postgraduate+College+Quetta&z=15&output=embed"
  });

  useEffect(() => {
    const fetchData = () => {
      fetch(`/api/contact?t=${Date.now()}`, { cache: "no-store" })
        .then(res => res.json())
        .then(data => { if (data?.address) setContact(data); })
        .catch(()=>{});
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="contact" className="px-6 md:px-20 py-16 bg-gray-50">
      <h2 className="text-3xl font-black text-center text-[#0d2a54]">Contact Us</h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mt-10">
        <div className="bg-white p-8 rounded-xl shadow">
          <h3 className="font-black text-xl text-[#0d2a54]">Get in Touch</h3>
          <div className="mt-8 space-y-6 text-lg">
            <p className="leading-relaxed"><span className="font-bold text-[#0d2a54]">📍 Address:</span> <span className="font-medium">{contact.address}</span></p>
            <p className="leading-relaxed"><span className="font-bold text-[#0d2a54]">📞 Phone:</span> <span className="font-medium">{contact.phone}</span></p>
            <p className="leading-relaxed"><span className="font-bold text-[#0d2a54]">📧 Email:</span> <span className="font-medium">{contact.email}</span></p>
          </div>
        </div>
        <div className="bg-white p-2 rounded-xl shadow">
          <iframe src={contact.mapUrl} width="100%" height="420" style={{border:0}} className="rounded-lg" loading="lazy"></iframe>
        </div>
      </div>
    </section>
  );
}