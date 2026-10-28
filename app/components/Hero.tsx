"use client";
import { useState, useEffect } from "react";

const DEFAULT_IMAGES = [
  { image: "/hero1.jpeg", order: 1 },
  { image: "/hero2.jpeg", order: 2 },
  { image: "/hero3.jpeg", order: 3 },
  { image: "/hero4.jpeg", order: 4 },
  { image: "/hero5.jpeg", order: 5 },
  { image: "/hero6.jpeg", order: 6 },
];

export default function Hero({ images: propImages, current = 0, setShowForm, scrollTo }: any) {
  const [allImages, setAllImages] = useState<string[]>(DEFAULT_IMAGES.map(d=>d.image));

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/home", { cache: "no-store" });
        const data = await res.json();
        
        let combined: any[] = [...DEFAULT_IMAGES];

        if (data?.hero?.length > 0) {
          // Admin se aaye hue pics jisme order hoga (1=Start, 20=End)
          const extras = data.hero.map((h: any) => ({
            image: typeof h === 'string' ? h : h.image,
            order: h.order ?? 10
          })).filter((h:any)=>h.image);

          combined = [...combined, ...extras];
        }

        // Parent se propImages agar aaye hain to unko bhi add karo
        if (propImages && propImages.length > 0) {
          const fromProps = propImages.map((img: any, i:number) => ({
            image: typeof img === 'string' ? img : img.image,
            order: 20 + i
          })).filter((h:any)=>h.image);
          combined = [...combined, ...fromProps];
        }

        // Order ke hisab se sort karo: 1 sabse pehle, 20 sabse aakhir me
        combined.sort((a,b)=> a.order - b.order);

        // Duplicate hatao aur max 16 pics (6 default + 10 extra)
        const unique = Array.from(new Set(combined.map(c=>c.image))).slice(0, 16);
        
        // Agar unique se order kharab hua ho to dubara order wali list se map karo
        const finalSorted = combined.filter((c, idx, arr)=> arr.findIndex(x=>x.image===c.image)===idx)
                                   .slice(0,16)
                                   .map(c=>c.image);

        setAllImages(finalSorted.length > 0 ? finalSorted : DEFAULT_IMAGES.map(d=>d.image));

      } catch {
        setAllImages(DEFAULT_IMAGES.map(d=>d.image));
      }
    };
    load();
  }, [propImages]);

  return (
    <section id="home" className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 bg-gradient-to-br from-blue-50 to-white gap-10">
      <div className="flex-1">
        <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold">Admission Open 2025-26</span>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-5 text-gray-900">Shape Your Future<br /><span className="text-blue-700">with Quality Education</span></h1>
        <p className="mt-4 text-gray-600">Welcome to Govt. General Muhammad Musa Postgraduate College Quetta - Since 1987, providing quality education in Balochistan.</p>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowForm(true)} className="bg-blue-700 text-white px-7 py-3 rounded-lg font-bold">Apply Now</button>
          <button onClick={() => scrollTo('about')} className="bg-white border px-7 py-3 rounded-lg font-bold">Learn More</button>
        </div>
      </div>
      <div className="flex-1 relative w-full h-[400px] overflow-hidden rounded-[20px] shadow-2xl bg-[#0d2a54]">
        {allImages.map((img: string, i: number) => (
          <img 
            key={img+i} 
            src={img} 
            alt="" 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`} 
            onError={(e:any)=>{ e.target.style.display='none' }} 
          />
        ))}
      </div>
    </section>
  );
}