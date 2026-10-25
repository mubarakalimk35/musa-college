"use client";
import { useState } from "react";
const images = [
  { src: "/gallery/campus1.jpg", title: "College Main Building", cat: "Campus" },
  { src: "/gallery/campus2.jpg", title: "Science Lab", cat: "Campus" },
  { src: "/gallery/sports1.jpg", title: "Annual Sports Day 2024", cat: "Sports" },
  { src: "/gallery/event1.jpg", title: "Independence Day Function", cat: "Events" },
  { src: "/gallery/event2.jpg", title: "Seminar on AI", cat: "Events" },
  { src: "/gallery/faculty.jpg", title: "Faculty Group Photo", cat: "Faculty" },
];
export default function Gallery() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<string|null>(null);
  const cats = ["All", ...Array.from(new Set(images.map(i => i.cat)))];
  const filtered = filter === "All" ? images : images.filter(i => i.cat === filter);
  return (
    <section id="gallery" className="px-6 md:px-20 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10"><span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold">OUR MOMENTS</span><h2 className="text-3xl font-black text-[#0d2a54] mt-3">Gallery</h2></div>
        <div className="flex gap-2 flex-wrap justify-center mb-8">{cats.map(c => (<button key={c} onClick={() => setFilter(c)} className={`px-4 py-1.5 rounded-full text-[12px] font-bold border ${filter === c ? 'bg-green-700 text-white' : 'bg-white text-gray-600'}`}>{c}</button>))}</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((img,i) => (
            <div key={i} onClick={() => setSelected(img.src)} className="group relative rounded-2xl overflow-hidden border bg-white aspect-[4/3] cursor-pointer">
              <img src={img.src} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" onError={(e:any)=>{e.target.src=`https://picsum.photos/seed/${i}/400/300`}} />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-3"><p className="text-white text-[12px] font-bold">{img.title}</p></div>
            </div>
          ))}
        </div>
        {selected && (<div onClick={() => setSelected(null)} className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6"><img src={selected} className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl" /></div>)}
      </div>
    </section>
  );
}