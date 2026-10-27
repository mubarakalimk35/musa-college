"use client";
import { useState, useEffect } from "react";

const defaultNews = [
  { date: "15 Oct 2025", title: "Admission Open for BS Programs 2025-26 - Last Date 30 Oct", tag: "Admission", color: "bg-green-100 text-green-700" },
  { date: "10 Oct 2025", title: "College will remain closed on 12th Rabi-ul-Awal", tag: "Holiday", color: "bg-red-100 text-red-700" },
];

const defaultEvents = [
  { date: "25 Oct 2025", title: "Seminar on Artificial Intelligence - CS Department", time: "10:00 AM", location: "Main Hall" },
  { date: "20 Oct 2025", title: "Annual Sports Day - Opening Ceremony", time: "09:00 AM", location: "College Ground" },
];

const getTagStyle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("admission")) return { tag: "Admission", color: "bg-green-100 text-green-700" };
  if (t.includes("exam") || t.includes("date sheet")) return { tag: "Exam", color: "bg-blue-100 text-blue-700" };
  if (t.includes("holiday") || t.includes("closed")) return { tag: "Holiday", color: "bg-red-100 text-red-700" };
  if (t.includes("sports")) return { tag: "Sports", color: "bg-orange-100 text-orange-700" };
  return { tag: "News", color: "bg-slate-100 text-slate-700" };
};

export default function NewsAndEvents() {
  const [newsData, setNewsData] = useState(defaultNews);
  const [eventsData, setEventsData] = useState(defaultEvents);
  const [newsIndex, setNewsIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [pausedNews, setPausedNews] = useState(false);
  const [pausedEvent, setPausedEvent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // News filter
          const newsOnly = data.filter((d: any) => d.category === "News" || !d.category);
          if (newsOnly.length > 0) {
            setNewsData(newsOnly.map((n: any) => {
              const style = getTagStyle(n.title);
              return {
                date: new Date(n.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
                title: n.title,
                tag: style.tag,
                color: style.color,
              };
            }));
          }
          // Events filter
          const eventsOnly = data.filter((d: any) => d.category === "Events");
          if (eventsOnly.length > 0) {
            setEventsData(eventsOnly.map((e: any) => ({
              date: new Date(e.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
              title: e.title,
              time: e.time || "10:00 AM",
              location: e.location || "College Campus",
            })));
          }
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (pausedNews || newsData.length === 0) return;
    const timer = setInterval(() => { setNewsIndex((prev) => (prev + 1) % newsData.length); }, 3000);
    return () => clearInterval(timer);
  }, [pausedNews, newsData.length]);

  useEffect(() => {
    if (pausedEvent || eventsData.length === 0) return;
    const timer = setInterval(() => { setEventIndex((prev) => (prev + 1) % eventsData.length); }, 3500);
    return () => clearInterval(timer);
  }, [pausedEvent, eventsData.length]);

  return (
    <section id="news" className="px-6 md:px-20 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold">LATEST UPDATES</span>
          <h2 className="text-3xl font-black text-[#0d2a54] mt-3">News & Events</h2>
          <p className="text-gray-500 mt-2 text-sm">Stay updated with latest news and upcoming events</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* News */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            <div className="bg-[#0d2a54] text-white p-4 flex justify-between items-center">
              <h3 className="font-black text-sm flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>Latest News</h3>
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full">{newsData.length} Live</span>
            </div>
            <div className="h-[320px] relative overflow-hidden" onMouseEnter={() => setPausedNews(true)} onMouseLeave={() => setPausedNews(false)}>
              <div className="transition-transform duration-700 ease-in-out" style={{ transform: `translateY(-${newsIndex * 80}px)` }}>
                {[...newsData, ...newsData].map((news, i) => (
                  <div key={i} className="h-[80px] p-4 flex gap-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="shrink-0"><p className="text-[10px] font-bold text-gray-400">{news.date}</p><span className={`text-[9px] font-black px-2 py-0.5 rounded-full mt-1 inline-block ${news.color}`}>{news.tag}</span></div>
                    <p className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 flex justify-center gap-1.5 bg-gray-50">{newsData.map((_, i) => (<div key={i} className={`w-1.5 h-1.5 rounded-full transition ${i === newsIndex ? 'bg-blue-700 w-6' : 'bg-gray-300'}`}></div>))}</div>
          </div>

          {/* Events */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            <div className="bg-green-700 text-white p-4 flex justify-between items-center">
              <h3 className="font-black text-sm flex items-center gap-2"><span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>Upcoming Events</h3>
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full">{eventsData.length} Live</span>
            </div>
            <div className="h-[320px] relative overflow-hidden" onMouseEnter={() => setPausedEvent(true)} onMouseLeave={() => setPausedEvent(false)}>
              <div className="transition-transform duration-700 ease-in-out" style={{ transform: `translateY(-${eventIndex * 80}px)` }}>
                {[...eventsData, ...eventsData].map((ev, i) => (
                  <div key={i} className="h-[80px] p-4 flex gap-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="shrink-0 w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center"><p className="text-[14px] font-black text-blue-700 leading-none">{ev.date.split(" ")[0]}</p><p className="text-[9px] font-bold text-gray-500">{ev.date.split(" ")[1]}</p></div>
                    <div><p className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2">{ev.title}</p><p className="text-[10px] text-gray-500 mt-1">🕒 {ev.time} | 📍 {ev.location}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 flex justify-center gap-1.5 bg-gray-50">{eventsData.map((_, i) => (<div key={i} className={`w-1.5 h-1.5 rounded-full transition ${i === eventIndex ? 'bg-green-700 w-6' : 'bg-gray-300'}`}></div>))}</div>
          </div>
        </div>
      </div>
    </section>
  );
}