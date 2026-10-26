"use client";
import { useState } from "react";
import Link from "next/link";

const images = [
  { src: "/gallery/campus1.jpg", title: "College Main Building", cat: "Campus" },
  { src: "/gallery/campus2.jpg", title: "Science Lab", cat: "Campus" },
  { src: "/gallery/sports1.jpg", title: "Annual Sports Day 2024", cat: "Sports" },
  { src: "/gallery/event1.jpg", title: "Independence Day Function", cat: "Events" },
  { src: "/gallery/event2.jpg", title: "Seminar on AI", cat: "Events" },
  { src: "/gallery/faculty.jpg", title: "Faculty Group Photo", cat: "Faculty" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<string|null>(null);
  const cats = ["All", ...Array.from(new Set(images.map(i => i.cat)))];
  const filtered = filter === "All" ? images : images.filter(i => i.cat === filter);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Link href="/" className="inline-block mb-6 text-sm font-bold bg-white px-4 py-2 rounded-full shadow">← Back to Home</Link>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="text-center mb-10">
            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-bold tracking-widest">OUR MOMENTS</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0d2a54] mt-3">College Gallery</h2>
            <p className="text-gray-500 text-[13px] mt-2">Campus life, events and memories</p>
          </div>

          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {cats.map(c => (
              <button 
                key={c} 
                onClick={() => setFilter(c)} 
                className={`px-5 py-2 rounded-full text-[12px] font-bold border transition-all ${filter === c ? 'bg-green-700 text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* 3 COLUMNS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((img,i) => (
              <div key={i} onClick={() => setSelected(img.src)} className="group relative rounded-2xl overflow-hidden border-2 border-gray-100 bg-white aspect-[4/3] cursor-pointer hover:shadow-xl hover:border-green-200 transition-all">
                <img 
                  src={img.src} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  onError={(e:any)=>{e.target.src=`https://picsum.photos/seed/${i}/400/300`}} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <p className="text-white text-[13px] font-bold">{img.title}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && <p className="text-center text-gray-400 mt-10">No images found.</p>}
        </div>

        {/* Lightbox */}
        {selected && (
          <div onClick={() => setSelected(null)} className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-6 cursor-pointer">
            <img src={selected} className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl" />
            <button className="absolute top-6 right-6 bg-white text-black w-10 h-10 rounded-full font-black">×</button>
          </div>
        )}
      </div>
    </main>
  );
}