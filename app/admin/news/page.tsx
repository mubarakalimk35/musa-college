"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { offlinePost } from "@/lib/offlineSync";

type Item = { id:string; title:string; date:string; description?:string; content?:string; category:"News"|"Events"; time?:string; location?:string; isTicker?:boolean; }

export default function AdminNews() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"News" | "Events">("News");
  const [allData, setAllData] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isTicker, setIsTicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const datePickerRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/news", { cache: "no-store" });
      const data = await res.json();
      setAllData(Array.isArray(data) ? data : data.news || data.data || []);
    } catch { }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => { setTitle(""); setDate(""); setDesc(""); setTime(""); setLocation(""); setIsTicker(false); }, [activeTab]);

  const filteredData = allData.filter(d => d.category === activeTab);
  const formatDateDisplay = (s: string) => { if(!s) return ""; try{ if(s.includes("-")) return new Date(s).toLocaleDateString("en-GB"); return s; }catch{ return s; } }
  const toISODate = (dmy: string) => { const p=dmy.split("/"); return p.length===3 ? `${p[2]}-${p[1]}-${p[0]}` : dmy; }
  const handleDateChange = (val: string) => { let v=val.replace(/\D/g,"").slice(0,8); if(v.length>=5) v=v.slice(0,2)+"/"+v.slice(2,4)+"/"+v.slice(4); else if(v.length>=3) v=v.slice(0,2)+"/"+v.slice(2); setDate(v); }
  const onCalendarPick = (e: any) => { const iso=e.target.value; if(!iso) return; const [y,m,d]=iso.split("-"); setDate(`${d}/${m}/${y}`); }

  const handleAdd = async () => {
    if (!title.trim() || !date.trim()) { alert("Title & Date required!"); return; }
    setUploading(true);
    const payload: Item = { 
      id: `${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      title: title.trim(), 
      date: toISODate(date),
      description: desc.trim(),
      content: desc.trim(),
      category: activeTab,
      time: activeTab === "Events" ? time.trim() : "",
      location: activeTab === "Events" ? location.trim() : "",
      isTicker,
    };
    try { await offlinePost("/api/news", payload as any); setAllData(prev => [...prev, payload]); setTitle(""); setDate(""); setDesc(""); setTime(""); setLocation(""); setIsTicker(false); } catch (e){ console.error(e); } finally { setUploading(false); }
  };

  const toggleTicker = async (item: Item) => {
    const newVal = !item.isTicker;
    setAllData(prev => prev.map(x => x.id === item.id ? { ...x, isTicker: newVal } : x));
    await offlinePost("/api/news", { id: item.id, isTicker: newVal, _method: "PATCH", category: item.category } as any);
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await offlinePost("/api/news", { id, _method: "DELETE" } as any);
    setAllData(prev => prev.filter(x => x.id !== id));
  };

  const inputClass = "w-full mt-1 border-2 border-slate-200 p-3 rounded-xl text-sm bg-white text-black font-bold placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition";

  return (
    <div className="min-h-screen md:h-screen bg-[#f8fafc] p-3 md:p-4 font-sans flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 md:mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin")} className="w-9 h-9 bg-white border rounded-full flex items-center justify-center hover:bg-black hover:text-white transition shadow-sm">←</button>
            <div><h1 className="text-[18px] md:text-2xl font-black text-[#0f172a] leading-none">News & Events</h1><p className="text-[11px] md:text-xs text-slate-500 mt-1">{filteredData.length} {activeTab}</p></div>
          </div>
          <div className="bg-white border rounded-full p-1 flex gap-1 self-start md:self-auto">
            <button onClick={() => setActiveTab("News")} className={`px-5 py-1.5 rounded-full text-xs font-black transition ${activeTab==="News" ? "bg-[#0d2a54] text-white shadow" : "text-slate-500"}`}>📰 News</button>
            <button onClick={() => setActiveTab("Events")} className={`px-5 py-1.5 rounded-full text-xs font-black transition ${activeTab==="Events" ? "bg-green-700 text-white shadow" : "text-slate-500"}`}>📅 Events</button>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-3 md:gap-4 flex-1 overflow-auto md:overflow-hidden">
          <div className="md:col-span-2 bg-white rounded-2xl border p-4 md:p-5 flex flex-col md:overflow-auto">
            <h2 className="font-black text-[15px] text-black">Add {activeTab}</h2>
            <p className="text-[11px] text-slate-500 mb-3">Publishing to {activeTab}</p>
            <div className="space-y-3">
              <div><label className="text-[10px] font-black uppercase">Title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Admission Open 2026" className={inputClass} /></div>
              <div>
                <label className="text-[10px] font-black uppercase">Date</label>
                <div className="relative mt-1">
                  <input type="text" value={date} onChange={e => handleDateChange(e.target.value)} placeholder="dd/mm/yyyy" className={`${inputClass} pr-12 tracking-widest`} />
                  <button type="button" onClick={() => datePickerRef.current?.showPicker()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-[14px]">📅</button>
                  <input ref={datePickerRef} type="date" onChange={onCalendarPick} className="absolute opacity-0 pointer-events-none w-0 h-0" />
                </div>
              </div>
              {activeTab === "Events" && (
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[10px] font-black uppercase">Time</label><input value={time} onChange={e => setTime(e.target.value)} placeholder="10:00 AM" className={inputClass} /></div>
                  <div><label className="text-[10px] font-black uppercase">Location</label><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Main Hall" className={inputClass} /></div>
                </div>
              )}
              <div><label className="text-[10px] font-black uppercase">Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Short description..." className={inputClass} /></div>
              
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
                <input type="checkbox" id="isTicker" checked={isTicker} onChange={e => setIsTicker(e.target.checked)} className="w-4 h-4 accent-red-600" />
                <label htmlFor="isTicker" className="text-[10px] font-black uppercase cursor-pointer">Show in Ticker 🔴 Live</label>
              </div>

              <button onClick={handleAdd} disabled={uploading} className={`w-full font-black text-[13px] py-3 rounded-xl transition text-white active:scale-[0.98] ${activeTab==="News" ? "bg-[#0d2a54]" : "bg-green-700"} disabled:opacity-60`}>{uploading ? "Publishing..." : `+ Publish ${activeTab}`}</button>
            </div>
          </div>

          <div className="md:col-span-3 bg-white rounded-2xl border p-4 md:p-5 flex flex-col overflow-hidden min-h-[380px]">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h2 className="font-black text-[14px] text-black">{activeTab} List ({filteredData.length})</h2>
              <span className={`text-[9px] px-2.5 py-1 rounded-full font-black text-white ${activeTab==="News" ? "bg-[#0d2a54]" : "bg-green-700"}`}>{activeTab.toUpperCase()}</span>
            </div>
            <div className="space-y-2 overflow-auto flex-1 pr-1">
              {filteredData.length === 0 && <div className="text-center py-16 text-slate-400 text-[13px]">No {activeTab} yet. Add from left.</div>}
              {filteredData.map((n) => (
                <div key={n.id} className={`flex gap-3 p-3 rounded-xl border transition ${n.isTicker ? "bg-amber-50 border-amber-300" : "hover:bg-slate-50"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[14px] shrink-0 ${activeTab==="News" ? "bg-blue-50 text-blue-700 border" : "bg-green-50 text-green-700 border"}`}>{activeTab==="News" ? "📰" : "📅"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-black text-black truncate flex items-center gap-2">{n.title}{n.isTicker && <span className="bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">TICKER</span>}</p>
                    <p className="text-[11px] text-slate-600 truncate mt-0.5">{n.description || n.content || "No description"}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="bg-slate-900 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">{formatDateDisplay(n.date)}</span>
                      {n.time && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[9px] font-bold">{n.time}</span>}
                      {n.location && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[9px] font-bold">{n.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-center">
                    <button onClick={() => toggleTicker(n)} className={`w-8 h-8 rounded-lg border flex items-center justify-center transition text-[12px] ${n.isTicker ? "bg-red-600 text-white border-red-600" : "bg-white hover:bg-amber-100"}`}>📌</button>
                    <button onClick={() => del(n.id)} className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition text-[12px]">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}