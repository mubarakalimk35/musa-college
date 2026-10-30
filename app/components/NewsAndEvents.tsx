"use client";
import { useState, useEffect } from "react";

const getTagStyle = (title: string) => {
  const t = String(title||"").toLowerCase();
  if (t.includes("admission")) return { tag: "Admission", color: "bg-green-100 text-green-700" };
  if (t.includes("exam") || t.includes("date sheet")) return { tag: "Exam", color: "bg-blue-100 text-blue-700" };
  if (t.includes("holiday") || t.includes("closed")) return { tag: "Holiday", color: "bg-red-100 text-red-700" };
  if (t.includes("sports")) return { tag: "Sports", color: "bg-orange-100 text-orange-700" };
  return { tag: "News", color: "bg-slate-100 text-slate-700" };
};

// ✅ Safe link - no dangerouslySetInnerHTML
const RenderWithLinks = ({ text }: { text: string }) => {
  if (!text) return null;
  const parts = String(text).split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((p, i) => 
        p.match(/^https?:\/\//) ? 
        <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold hover:text-blue-800 break-all">{p}</a> 
        : <span key={i}>{p}</span>
      )}
    </>
  );
};

export default function NewsAndEvents() {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [newsIndex, setNewsIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [pausedNews, setPausedNews] = useState(false);
  const [pausedEvent, setPausedEvent] = useState(false);

  useEffect(() => {
    (async () => {
      const processData = (data: any[]) => {
        if (!Array.isArray(data)) return;
        const newsOnly = data.filter((d: any) => d.category === "News" || !d.category);
        setNewsData(newsOnly.map((n: any) => {
          const style = getTagStyle(n.title);
          return {
            id: String(n.id || n.title),
            date: new Date(n.date || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            title: String(n.title||"").slice(0,120),
            description: String(n.content || n.description || "").slice(0,200),
            tag: style.tag,
            color: style.color,
          };
        }));
        
        const eventsOnly = data.filter((d: any) => d.category === "Events");
        setEventsData(eventsOnly.map((e: any) => ({
          id: String(e.id || e.title),
          date: new Date(e.date || Date.now()).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          title: String(e.title||"").slice(0,120),
          description: String(e.content || e.description || "").slice(0,200),
          time: String(e.time || "10:00 AM").slice(0,20),
          location: String(e.location || "College Campus").slice(0,40),
        })));
      };

      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        if (!res.ok) throw new Error("DB_DOWN");
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.news || data.data || [];
        if (list.length > 0) localStorage.setItem("cached_news", JSON.stringify(list));
        processData(list);
      } catch {
        const cached = localStorage.getItem("cached_news");
        if (cached) {
          try { processData(JSON.parse(cached)); } catch {}
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (pausedNews || newsData.length <=1) return;
    const timer = setInterval(() => { setNewsIndex((prev) => (prev + 1) % newsData.length); }, 3500);
    return () => clearInterval(timer);
  }, [pausedNews, newsData.length]);

  useEffect(() => {
    if (pausedEvent || eventsData.length <=1) return;
    const timer = setInterval(() => { setEventIndex((prev) => (prev + 1) % eventsData.length); }, 4000);
    return () => clearInterval(timer);
  }, [pausedEvent, eventsData.length]);

  if (newsData.length === 0 && eventsData.length === 0) {
    return (
      <section id="news" className="px-4 md:px-20 py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-[11px] font-black">LATEST UPDATES</span>
          <h2 className="text-[24px] md:text-3xl font-black text-[#0d2a54] mt-3">News & Events</h2>
          <p className="text-gray-500 mt-4 text-sm">No news or events at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="newsandevents" className="px-4 md:px-20 py-12 md:py-16 bg-gray-50 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-[11px] font-black">LATEST UPDATES</span>
          <h2 className="text-[24px] md:text-3xl font-black text-[#0d2a54] mt-3">News & Events</h2>
          <p className="text-gray-500 mt-2 text-[13px] md:text-sm">Stay updated with latest news and upcoming events</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* News */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
            <div className="bg-[#0d2a54] text-white p-4 flex justify-between items-center">
              <h3 className="font-black text-[13px] md:text-sm flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>Latest News</h3>
              <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-black">{newsData.length} Live</span>
            </div>
            <div className="h-[320px] relative overflow-hidden" 
              onMouseEnter={() => setPausedNews(true)} onMouseLeave={() => setPausedNews(false)}
              onTouchStart={() => setPausedNews(true)} onTouchEnd={() => setPausedNews(false)}
            >
              <div className="transition-transform duration-700 ease-in-out" style={{ transform: `translateY(-${newsIndex * 80}px)` }}>
                {[...newsData, ...newsData].map((news, i) => (
                  <div key={`${news.id}-${i}`} className="h-[80px] p-4 flex gap-3 border-b border-gray-50">
                    <div className="shrink-0"><p className="text-[10px] font-black text-gray-400">{news.date}</p><span className={`text-[9px] font-black px-2 py-0.5 rounded-full mt-1 inline-block ${news.color}`}>{news.tag}</span></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-black text-gray-800 leading-tight truncate">{news.title}</p>
                      {news.description && <p className="text-[11px] text-gray-500 mt-1 truncate"><RenderWithLinks text={news.description} /></p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 flex justify-center gap-1.5 bg-gray-50 border-t">{newsData.map((_, i) => (<div key={i} className={`h-1.5 rounded-full transition-all ${i === newsIndex ? 'bg-[#0d2a54] w-6' : 'bg-gray-300 w-1.5'}`}></div>))}</div>
          </div>

          {/* Events */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
            <div className="bg-green-700 text-white p-4 flex justify-between items-center">
              <h3 className="font-black text-[13px] md:text-sm flex items-center gap-2"><span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>Upcoming Events</h3>
              <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-black">{eventsData.length} Live</span>
            </div>
            <div className="h-[320px] relative overflow-hidden"
              onMouseEnter={() => setPausedEvent(true)} onMouseLeave={() => setPausedEvent(false)}
              onTouchStart={() => setPausedEvent(true)} onTouchEnd={() => setPausedEvent(false)}
            >
              <div className="transition-transform duration-700 ease-in-out" style={{ transform: `translateY(-${eventIndex * 80}px)` }}>
                {[...eventsData, ...eventsData].map((ev, i) => (
                  <div key={`${ev.id}-${i}`} className="h-[80px] p-4 flex gap-3 border-b border-gray-50">
                    <div className="shrink-0 w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center"><p className="text-[14px] font-black text-blue-700 leading-none">{ev.date.split(" ")[0]}</p><p className="text-[9px] font-bold text-gray-500">{ev.date.split(" ")[1]}</p></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-black text-gray-800 leading-tight truncate">{ev.title}</p>
                      <p className="text-[10px] text-gray-500 mt-1 truncate">🕒 {ev.time} | 📍 {ev.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 flex justify-center gap-1.5 bg-gray-50 border-t">{eventsData.map((_, i) => (<div key={i} className={`h-1.5 rounded-full transition-all ${i === eventIndex ? 'bg-green-700 w-6' : 'bg-gray-300 w-1.5'}`}></div>))}</div>
          </div>
        </div>
      </div>
    </section>
  );
}