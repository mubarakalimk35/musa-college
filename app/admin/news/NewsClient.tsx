"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/news", { cache: 'no-store' });
      if(res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.news || data.data || [];
        setAllData(list);
        try { localStorage.setItem("news_cache", JSON.stringify(list)); } catch {}
        return;
      }
      const cached = localStorage.getItem("news_cache");
      if(cached) setAllData(JSON.parse(cached));
    } catch { 
      try { const c = localStorage.getItem("news_cache"); if(c) setAllData(JSON.parse(c)); } catch {}
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setTitle(""); setDate(""); setDesc(""); setTime(""); setLocation(""); setIsTicker(false); }, [activeTab]);

  const filteredData = useMemo(() => allData.filter(d => d.category === activeTab), [allData, activeTab]);

  const formatDateDisplay = (s: string) => { 
    if(!s) return ""; 
    try{ const d = new Date(s); return isNaN(d.getTime()) ? s : d.toLocaleDateString("en-GB"); }catch{ return s; } 
  }
  const toISODate = (dmy: string) => { 
    const p=dmy.split("/"); 
    if(p.length!==3) return null;
    const [dd,mm,yyyy] = p.map(Number);
    const d = new Date(yyyy, mm-1, dd);
    if(d.getFullYear()!==yyyy || d.getMonth()!==mm-1 || d.getDate()!==dd) return null;
    return `${p[2]}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`; 
  }

  const handleDateChange = (val: string) => { 
    let v=val.replace(/\D/g,"").slice(0,8); 
    if(v.length>=5) v=v.slice(0,2)+"/"+v.slice(2,4)+"/"+v.slice(4); 
    else if(v.length>=3) v=v.slice(0,2)+"/"+v.slice(2); 
    setDate(v); 
  }

  const handleAdd = async () => {
    if (!title.trim() || !date.trim()) return alert("Title & Date required!");
    const iso = toISODate(date);
    if(!iso) return alert("Invalid Date!");
    setUploading(true);
    const payload: Item = { 
      id: crypto.randomUUID(),
      title: title.trim().slice(0,150), 
      date: iso,
      description: desc.trim().slice(0,500),
      content: desc.trim().slice(0,500),
      category: activeTab,
      time: activeTab === "Events" ? time.trim().slice(0,50) : "",
      location: activeTab === "Events" ? location.trim().slice(0,100) : "",
      isTicker,
    };
    const prev = allData;
    setAllData(p => [...p, payload]);
    try { 
      await offlinePost("/api/news", payload as any); 
      setTitle(""); setDate(""); setDesc(""); setTime(""); setLocation(""); setIsTicker(false); 
    } catch { setAllData(prev); alert("Save failed"); } 
    finally { setUploading(false); }
  };

  const toggleTicker = async (item: Item) => {
    const prev = allData;
    setAllData(p => p.map(x => x.id === item.id ? { ...x, isTicker: !x.isTicker } : x));
    try{ await offlinePost("/api/news", { id: item.id, isTicker: !item.isTicker, _method: "PATCH", category: item.category } as any); }catch{ setAllData(prev); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    const prev = allData;
    setAllData(p => p.filter(x => x.id !== id));
    try{ await offlinePost("/api/news", { id, _method: "DELETE" } as any); }catch{ setAllData(prev); alert("Delete failed"); }
  };

  const inputClass = "w-full mt-1 border-2 border-black p-3 rounded-xl text-sm bg-white text-black font-bold placeholder:text-black placeholder:opacity-60 outline-none focus:border-black focus:ring-0";

  return (
    <div className="min-h-screen bg-white p-3 md:p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin")} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black hover:bg-white hover:text-black hover:border-2 hover:border-black transition">←</button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-black leading-none">News & Events</h1>
              <p className="text-[13px] font-black text-black mt-1">Total: {filteredData.length} {activeTab}</p>
            </div>
          </div>
          <div className="bg-white border-2 border-black rounded-full p-1 flex gap-1">
            <button onClick={() => setActiveTab("News")} className={`px-5 py-1.5 rounded-full text-xs font-black border ${activeTab==="News" ? "bg-black text-white border-black" : "bg-white text-black border-black"}`}>News</button>
            <button onClick={() => setActiveTab("Events")} className={`px-5 py-1.5 rounded-full text-xs font-black border ${activeTab==="Events" ? "bg-black text-white border-black" : "bg-white text-black border-black"}`}>Events</button>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-2 bg-white rounded-2xl border-2 border-black p-5 h-fit">
            <h2 className="font-black text-lg text-black">Add {activeTab}</h2>
            <p className="text-sm font-bold text-black mb-4">Publishing to {activeTab}</p>
            <div className="space-y-3">
              <div><label className="text-[11px] font-black text-black uppercase">Title *</label><input value={title} maxLength={150} onChange={e => setTitle(e.target.value)} placeholder="Ex: Admission Open 2026" className={inputClass} /></div>
              <div>
                <label className="text-[11px] font-black text-black uppercase">Date *</label>
                <div className="relative mt-1">
                  <input value={date} onChange={e => handleDateChange(e.target.value)} placeholder="dd/mm/yyyy" className={`${inputClass} pr-12 tracking-widest`} />
                  <button type="button" onClick={() => { try{ (datePickerRef.current as any)?.showPicker() }catch{ datePickerRef.current?.click() } }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-black">📅</button>
                  <input ref={datePickerRef} type="date" onChange={e => { const [y,m,d]=e.target.value.split("-"); if(y) setDate(`${d}/${m}/${y}`) }} className="absolute opacity-0 w-0 h-0 pointer-events-none" />
                </div>
              </div>
              {activeTab === "Events" && (
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[11px] font-black text-black uppercase">Time</label><input value={time} onChange={e => setTime(e.target.value)} placeholder="10:00 AM" className={inputClass} /></div>
                  <div><label className="text-[11px] font-black text-black uppercase">Location</label><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Main Hall" className={inputClass} /></div>
                </div>
              )}
              <div><label className="text-[11px] font-black text-black uppercase">Description</label><textarea value={desc} maxLength={500} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Short description..." className={inputClass} /></div>
              <div className="flex items-center gap-2 bg-white border-2 border-black p-2.5 rounded-xl"><input type="checkbox" checked={isTicker} onChange={e => setIsTicker(e.target.checked)} className="w-5 h-5 accent-black" /><span className="text-[12px] font-black text-black">Show in Ticker 🔴 Live</span></div>
              <button onClick={handleAdd} disabled={uploading || !title.trim() || !date.trim()} className="w-full bg-black text-white font-black py-3.5 rounded-xl hover:bg-white hover:text-black hover:border-2 hover:border-black border-2 border-black disabled:opacity-50 transition-all">{uploading ? "Publishing..." : `+ Publish ${activeTab}`}</button>
            </div>
          </div>

          <div className="md:col-span-3 bg-white rounded-2xl border-2 border-black p-5 min-h-[400px] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-black text-lg">{activeTab} List</h2>
            </div>
            <div className="space-y-2 overflow-auto flex-1">
              {filteredData.length === 0 && <div className="text-center py-16"><p className="text-black font-black text-sm">No {activeTab} yet.</p></div>}
              {filteredData.map(n => (
                <div key={n.id} className={`flex gap-3 p-3 rounded-xl border-2 ${n.isTicker ? "bg-yellow-100 border-black" : "bg-white border-black"}`}>
                  <div className="w-10 h-10 rounded-xl bg-white border-2 border-black text-black flex items-center justify-center font-black shrink-0 text-[18px]">{activeTab==="News" ? "📰" : "📅"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-black text-black truncate">{n.title} {n.isTicker && <span className="bg-white border border-black text-black text-[9px] px-2 py-0.5 rounded-full ml-1 font-black">LIVE</span>}</p>
                    <p className="text-[12px] font-bold text-black truncate mt-0.5">{n.description || "No description"}</p>
                    <div className="flex gap-1.5 mt-1.5 flex-wrap">
                      <span className="bg-white border-2 border-black text-black px-2.5 py-0.5 rounded-full text-[11px] font-black">{formatDateDisplay(n.date)}</span>
                      {n.time && <span className="bg-white border-2 border-black text-black px-2.5 py-0.5 rounded-full text-[11px] font-black">{n.time}</span>}
                      {n.location && <span className="bg-white border-2 border-black text-black px-2.5 py-0.5 rounded-full text-[11px] font-black">{n.location}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1.5 self-center"><button onClick={() => toggleTicker(n)} className={`w-9 h-9 rounded-lg border-2 border-black flex items-center justify-center font-black ${n.isTicker ? "bg-black text-white" : "bg-white text-black"}`}>📌</button><button onClick={() => del(n.id)} className="w-9 h-9 bg-white border-2 border-black rounded-lg font-black text-black hover:bg-black hover:text-white">✕</button></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}