"use client";
import { useState, useEffect } from "react";

const newsData = [
  { date: "15 Oct 2025", title: "Admission Open for BS Programs 2025-26 - Last Date 30 Oct", tag: "Admission", color: "bg-green-100 text-green-700" },
  { date: "10 Oct 2025", title: "College will remain closed on 12th Rabi-ul-Awal", tag: "Holiday", color: "bg-red-100 text-red-700" },
  { date: "05 Oct 2025", title: "BS Computer Science 3rd Semester Exam Date Sheet Announced", tag: "Exam", color: "bg-blue-100 text-blue-700" },
  { date: "01 Oct 2025", title: "Annual Sports Week 2025 starting from 20th October", tag: "Sports", color: "bg-orange-100 text-orange-700" },
  { date: "28 Sep 2025", title: "Principal's meeting with faculty regarding new academic year", tag: "Meeting", color: "bg-purple-100 text-purple-700" },
];

const eventsData = [
  { date: "25 Oct 2025", title: "Seminar on Artificial Intelligence - CS Department", time: "10:00 AM", location: "Main Hall" },
  { date: "20 Oct 2025", title: "Annual Sports Day - Opening Ceremony", time: "09:00 AM", location: "College Ground" },
  { date: "18 Oct 2025", title: "Inter-College Debate Competition", time: "11:00 AM", location: "Seminar Hall" },
  { date: "15 Oct 2025", title: "Cleanliness Campaign by Zoology Department", time: "08:30 AM", location: "College Campus" },
];

export default function NewsAndEvents() {
  const [newsIndex, setNewsIndex] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [pausedNews, setPausedNews] = useState(false);
  const [pausedEvent, setPausedEvent] = useState(false);

  useEffect(() => {
    if (pausedNews) return;
    const timer = setInterval(() => {
      setNewsIndex((prev) => (prev + 1) % newsData.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [pausedNews]);

  useEffect(() => {
    if (pausedEvent) return;
    const timer = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % eventsData.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [pausedEvent]);

  return (
    <section id="news" className="px-6 md:px-20 py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold">LATEST UPDATES</span>
          <h2 className="text-3xl font-black text-[#0d2a54] mt-3">News & Events</h2>
          <p className="text-gray-500 mt-2 text-sm">Stay updated with latest news and upcoming events</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* NEWS - Slide Up */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            <div className="bg-[#0d2a54] text-white p-4 flex justify-between items-center">
              <h3 className="font-black text-sm flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>Latest News</h3>
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full">Auto Sliding</span>
            </div>
            <div 
              className="h-[320px] relative overflow-hidden"
              onMouseEnter={() => setPausedNews(true)}
              onMouseLeave={() => setPausedNews(false)}
            >
              <div 
                className="transition-transform duration-700 ease-in-out"
                style={{ transform: `translateY(-${newsIndex * 80}px)` }}
              >
                {[...newsData, ...newsData].map((news, i) => (
                  <div key={i} className="h-[80px] p-4 flex gap-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="shrink-0">
                      <p className="text-[10px] font-bold text-gray-400">{news.date}</p>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full mt-1 inline-block ${news.color}`}>{news.tag}</span>
                    </div>
                    <p className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2">{news.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 flex justify-center gap-1.5 bg-gray-50">
              {newsData.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition ${i === newsIndex ? 'bg-blue-700 w-6' : 'bg-gray-300'}`}></div>
              ))}
            </div>
          </div>

          {/* EVENTS - Slide Up */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            <div className="bg-green-700 text-white p-4 flex justify-between items-center">
              <h3 className="font-black text-sm flex items-center gap-2"><span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>Upcoming Events</h3>
              <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full">Auto Sliding</span>
            </div>
            <div 
              className="h-[320px] relative overflow-hidden"
              onMouseEnter={() => setPausedEvent(true)}
              onMouseLeave={() => setPausedEvent(false)}
            >
              <div 
                className="transition-transform duration-700 ease-in-out"
                style={{ transform: `translateY(-${eventIndex * 80}px)` }}
              >
                {[...eventsData, ...eventsData].map((ev, i) => (
                  <div key={i} className="h-[80px] p-4 flex gap-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="shrink-0 w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center">
                      <p className="text-[14px] font-black text-blue-700 leading-none">{ev.date.split(" ")[0]}</p>
                      <p className="text-[9px] font-bold text-gray-500">{ev.date.split(" ")[1]}</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2">{ev.title}</p>
                      <p className="text-[10px] text-gray-500 mt-1">🕒 {ev.time} | 📍 {ev.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 flex justify-center gap-1.5 bg-gray-50">
              {eventsData.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition ${i === eventIndex ? 'bg-green-700 w-6' : 'bg-gray-300'}`}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Breaking News Ticker Top */}
        <div className="mt-8 bg-[#0d2a54] rounded-full px-2 py-2 flex items-center gap-3 overflow-hidden">
          <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shrink-0 animate-pulse">BREAKING</span>
          <div className="flex-1 overflow-hidden">
            <p className="text-white text-[13px] font-bold whitespace-nowrap animate-[marquee_20s_linear_infinite]">
              Admission Open for BS Programs 2025-26 | Annual Sports Week starting 20th Oct | Exam Date Sheet Announced | College Timing 8:00 AM - 2:00 PM
            </p>
          </div>
        </div>
        <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
      </div>
    </section>
  );
}