"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
};

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery", { cache: 'no-store' });
        const data = await res.json();
        const arr = Array.isArray(data) ? data : []
        setImages(arr);
        localStorage.setItem("gallery_cache_public", JSON.stringify(arr))
      } catch {
        const cached = localStorage.getItem("gallery_cache_public");
        if (cached) {
          try{ setImages(JSON.parse(cached)); }catch{}
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const cats = ["All", "General", "Sports Week", "Convocation"];
  const filtered = filter === "All" ? images : images.filter(i => i.category === filter);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-[1600px] mx-auto w-full p-3 md:p-4 flex flex-col flex-1">
        {/* Header - Mobile stack */}
        <div className="flex justify-between items-center mb-3 shrink-0 gap-2">
          <Link href="/" className="text-[13px] md:text-sm font-black bg-white px-4 py-2.5 rounded-full shadow border shrink-0 hover:bg-black hover:text-white transition">
            ← Back
          </Link>
          <h2 className="text-[20px] md:text-3xl font-black text-[#0d2a54] text-center flex-1 truncate px-2">College Gallery</h2>
          <div className="w-[70px] md:w-[120px] shrink-0"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border flex-1 flex flex-col p-3 md:p-4 overflow-hidden">
          {/* Filters - Mobile scrollable */}
          <div className="flex gap-2 justify-start md:justify-center mb-4 shrink-0 overflow-x-auto scrollbar-none pb-1">
            {cats.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[12px] md:text-[13px] font-black border shrink-0 transition-all active:scale-95 ${filter === c ? 'bg-[#0d2a54] text-white shadow-md border-[#0d2a54]' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-200'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-3 flex-1 content-start">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl animate-pulse aspect-[4/3]"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-3 flex-1 content-start overflow-y-auto pr-1">
              {filtered.map((img) => (
                <div key={String(img.id)} onClick={() => setSelected(img.imageUrl)} className="group relative rounded-xl overflow-hidden border-2 border-gray-100 bg-white aspect-[4/3] cursor-pointer hover:shadow-lg hover:border-[#0d2a54]/20 transition-all active:scale-[0.98]">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500 bg-gray-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 md:opacity-0 transition flex items-end p-2.5">
                    <p className="text-white text-[12px] md:text-[13px] font-black leading-tight line-clamp-2">{img.title}</p>
                  </div>
                  {/* Mobile pe title hamesha dikhe */}
                  <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-[11px] font-bold truncate">{img.title}</p>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="col-span-full text-center text-gray-400 text-sm py-16">No images in {filter}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div onClick={() => setSelected(null)} className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-3 md:p-6 cursor-pointer backdrop-blur-sm">
          <img src={selected} alt="Gallery full" className="max-w-full max-h-[85vh] md:max-h-[90vh] rounded-2xl shadow-2xl object-contain" />
          <button onClick={() => setSelected(null)} className="absolute top-3 right-3 md:top-4 md:right-4 bg-white text-black w-10 h-10 rounded-full font-black text-xl hover:bg-gray-100 transition">×</button>
        </div>
      )}
    </main>
  );
}