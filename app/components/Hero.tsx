"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

const DEFAULT_IMAGES = [
  "/hero1.jpeg","/hero2.jpeg","/hero3.jpeg","/hero4.jpeg","/hero5.jpeg","/hero6.jpeg"
];

export default function Hero({ images: propImages, current = 0, setShowForm, scrollTo }: any) {
  const [fetchedExtra, setFetchedExtra] = useState<{image:string, order:number}[]>([]);

  useEffect(() => {
    // Agar propImages parent se aa rahe hain to dobara fetch mat karo - Speed
    if (propImages && propImages.length > 0) return;
    
    const load = async () => {
      try {
        const res = await fetch("/api/home", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data?.hero) && data.hero.length > 0) {
          const extras = data.hero.map((h: any, idx:number) => ({
            image: typeof h === 'string' ? h : h.image,
            order: typeof h.order === 'number' ? h.order : 10 + idx
          })).filter((h:any)=> h.image && typeof h.image === 'string');
          setFetchedExtra(extras);
        }
      } catch {}
    };
    load();
  }, [propImages]);

  const allImages = useMemo(() => {
    let combined: {image:string, order:number}[] = DEFAULT_IMAGES.map((img,i)=>({image: img, order: i+1}));

    if (fetchedExtra.length > 0) {
      combined = [...combined, ...fetchedExtra];
    }

    if (propImages && propImages.length > 0) {
      const fromProps = propImages.map((img: any, i:number) => ({
        image: typeof img === 'string' ? img : img.image,
        order: typeof img?.order === 'number' ? img.order : 20 + i
      })).filter((h:any)=> h.image);
      // propImages me default bhi ho sakta hai - isliye merge nahi, replace logic
      if (fromProps.length > 6) { // agar parent ne poora sorted bhej diya hai
        combined = fromProps;
      } else {
        combined = [...combined, ...fromProps];
      }
    }

    combined.sort((a,b)=> a.order - b.order);

    // ✅ Unique + 16 limit - ek hi bar
    const seen = new Set<string>();
    const unique: string[] = [];
    for (const c of combined) {
      if (!seen.has(c.image) && c.image.trim()) {
        seen.add(c.image);
        unique.push(c.image);
      }
      if (unique.length >= 16) break;
    }

    return unique.length > 0 ? unique : DEFAULT_IMAGES;
  }, [fetchedExtra, propImages]);

  // current index safe
  const safeCurrent = allImages.length > 0 ? current % allImages.length : 0;

  return (
    <section id="home" className="flex flex-col md:flex-row items-center justify-between px-4 md:px-20 py-8 md:py-12 bg-gradient-to-br from-blue-50 to-white gap-8 md:gap-10">
      <div className="flex-1 w-full">
        <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-[12px] md:text-sm font-black inline-block">Admission Open 2025-26</span>
        <h1 className="text-[28px] md:text-5xl font-extrabold leading-tight mt-4 md:mt-5 text-gray-900">Shape Your Future<br /><span className="text-blue-700">with Quality Education</span></h1>
        <p className="mt-3 md:mt-4 text-gray-600 text-[13px] md:text-base leading-relaxed">Welcome to Govt. General Muhammad Musa Postgraduate College Quetta - Since 1987, providing quality education in Balochistan.</p>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setShowForm?.(true)} className="bg-blue-700 text-white px-6 md:px-7 py-3 rounded-xl font-black text-sm active:scale-[0.98] transition hover:bg-blue-800">Apply Now</button>
          <button onClick={() => scrollTo?.('about')} className="bg-white border-2 px-6 md:px-7 py-3 rounded-xl font-black text-sm active:scale-[0.98] transition hover:border-black">Learn More</button>
        </div>
      </div>
      <div className="flex-1 relative w-full h-[280px] md:h-[400px] overflow-hidden rounded-[20px] shadow-2xl bg-[#0d2a54] shrink-0">
        {allImages.map((img: string, i: number) => (
          <Image 
            key={img} 
            src={img} 
            alt={`College Slide ${i+1}`}
            fill
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover transition-opacity duration-1000 will-change-auto ${i === safeCurrent ? "opacity-100" : "opacity-0"}`} 
          />
        ))}
        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {allImages.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i===safeCurrent ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}