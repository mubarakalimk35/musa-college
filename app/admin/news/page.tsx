"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { offlinePost } from "@/lib/offlineSync";

export default function AdminNews() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"News" | "Events">("News");
  const [allData, setAllData] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [isTicker, setIsTicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const datePickerRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const res = await fetch("/api/news", { cache: "no-store" });
    const data = await res.json();
    setAllData(Array.isArray(data) ? data : data.news || data.data || []);
  };
  useEffect(() => { load(); }, []);

  useEffect(() => {
    setTitle("");
    setDate("");
    setDesc("");
    setTime("");
    setLocation("");
    setIsTicker(false);
  }, [activeTab]);

  const filteredData = allData.filter((d) => d.category === activeTab);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) {
      try { return new Date(dateStr).toLocaleDateString("en-GB"); } catch { return dateStr; }
    }
    return dateStr;
  };

  const toISODate = (dmy: string) => {
    const parts = dmy.split("/");
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dmy;
  };

  const handleDateChange = (val: string) => {
    let v = val.replace(/\D/g, "").slice(0, 8);
    if (v.length >= 5) v = v.slice(0,2) + "/" + v.slice(2,4) + "/" + v.slice(4);
    else if (v.length >= 3) v = v.slice(0,2) + "/" + v.slice(2);
    setDate(v);
  };

  const onCalendarPick = (e: any) => {
    const iso = e.target.value;
    if (!iso) return;
    const [y,m,d] = iso.split("-");
    setDate(`${d}/${m}/${y}`);
  };

  const handleAdd = async () => {
    if (!title || !date) { alert("Title & Date required!"); return; }
    setUploading(true);
    try {
      const payload = { 
        id: Date.now().toString(),
        title, 
        date: toISODate(date),
        description: desc,
        content: desc,
        category: activeTab,
        time: activeTab === "Events" ? time : "",
        location: activeTab === "Events" ? location : "",
        isTicker: isTicker,
      };
      await offlinePost("/api/news", payload);
      setAllData(prev => [...prev, payload]);
    } catch (e) {
      console.error(e);
    }
    setTitle(""); setDate(""); setDesc(""); setTime(""); setLocation(""); setIsTicker(false);
    setUploading(false);
  };

  // RIGHT SIDE SE TICKER TOGGLE
  const toggleTicker = async (item: any) => {
    const newVal = !item.isTicker;
    setAllData(prev => prev.map(x => x.id === item.id ? { ...x, isTicker: newVal } : x));
    await offlinePost("/api/news", { id: item.id, isTicker: newVal, _method: "PATCH", category: item.category });
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await offlinePost("/api/news", { id, _method: "DELETE" });
    setAllData(prev => prev.filter(x => x.id !== id));
  };

  const inputClass = "w-full mt-1 border-2 border-slate-300 p-3 rounded-xl text-sm bg-white text-black font-bold placeholder:text-slate-400 placeholder:font-normal outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";

  return (
    <div className="h-screen bg-[#f8fafc] p-4 font-sans overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin")} className="w-9 h-9 bg-white border rounded-full flex items-center justify-center hover:bg-[#0f172a] hover:text-white transition shadow-sm">←</button>
            <div><h1 className="text-2xl font-black text-[#0f172a] leading-none">News & Events Manager</h1><p className="text-xs text-slate-500 mt-1">Manage {activeTab} - {filteredData.length} items</p></div>
          </div>
          <div className="bg-white border rounded-full p-1 flex gap-1">
            <button onClick={() => setActiveTab("News")} className={`px-5 py-1.5 rounded-full text-xs font-bold transition ${activeTab==="News" ? "bg-[#0d2a54] text-white" : "text-slate-500"}`}>📰 News</button>
            <button onClick={() => setActiveTab("Events")} className={`px-5 py-1.5 rounded-full text-xs font-bold transition ${activeTab==="Events" ? "bg-green-700 text-white" : "text-slate-500"}`}>📅 Events</button>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-4 flex-1 overflow-hidden">
          <div className="md:col-span-2 bg-white rounded-2xl border p-5 flex flex-col overflow-auto">
            <h2 className="font-bold text-lg text-black">Add {activeTab}</h2>
            <p className="text-xs text-slate-500 mb-4">Publishing to {activeTab} section</p>
            <div className="space-y-3">
              <div><label className="text-[11px] font-black text-black uppercase">Title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Admission Open 2026" className={inputClass} /></div>
              <div>
                <label className="text-[11px] font-black text-black uppercase">Date</label>
                <div className="relative mt-1">
                  <input type="text" value={date} onChange={e => handleDateChange(e.target.value)} placeholder="dd/mm/yyyy" className={`${inputClass} pr-12 tracking-widest font-black`} />
                  <button type="button" onClick={() => datePickerRef.current?.showPicker()} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">📅</button>
                  <input ref={datePickerRef} type="date" onChange={onCalendarPick} className="absolute opacity-0 pointer-events-none w-0 h-0" />
                </div>
              </div>
              {activeTab === "Events" && (
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-[11px] font-black text-black uppercase">Time</label><input value={time} onChange={e => setTime(e.target.value)} placeholder="10:00 AM" className={inputClass} /></div>
                  <div><label className="text-[11px] font-black text-black uppercase">Location</label><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Main Hall" className={inputClass} /></div>
                </div>
              )}
              <div><label className="text-[11px] font-black text-black uppercase">Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Write short description..." className={inputClass} /></div>
              
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <input type="checkbox" id="isTicker" checked={isTicker} onChange={e => setIsTicker(e.target.checked)} className="w-4 h-4" />
                <label htmlFor="isTicker" className="text-[11px] font-black text-black uppercase cursor-pointer">Show in Notice Ticker 🔴 Live</label>
              </div>

              <button onClick={handleAdd} disabled={uploading} className={`w-full font-bold text-sm py-3 rounded-xl transition text-white ${activeTab==="News" ? "bg-[#0d2a54]" : "bg-green-700"}`}>{uploading ? "Publishing..." : `+ Publish to ${activeTab}`}</button>
            </div>
          </div>

          <div className="md:col-span-3 bg-white rounded-2xl border p-5 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h2 className="font-bold text-black">{activeTab} List ({filteredData.length})</h2>
              <span className={`text-[10px] px-3 py-1 rounded-full font-bold text-white ${activeTab==="News" ? "bg-[#0d2a54]" : "bg-green-700"}`}>{activeTab.toUpperCase()}</span>
            </div>
            <div className="space-y-2 overflow-auto flex-1 pr-1">
              {filteredData.length === 0 && <div className="text-center py-16 text-slate-400 text-sm">No {activeTab} yet. Add from left.</div>}
              {filteredData.map((n: any) => (
                <div key={n.id} className={`flex gap-3 p-3 rounded-xl border transition ${n.isTicker ? "bg-amber-50 border-amber-300" : "hover:bg-slate-50"}`}>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${activeTab==="News" ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-green-50 text-green-700 border border-green-100"}`}>{activeTab==="News" ? "📰" : "📅"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-black truncate flex items-center gap-2">
                      {n.title}
                      {n.isTicker && <span className="bg-red-600 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-pulse">TICKER</span>}
                    </p>
                    <p className="text-[11px] text-black font-medium truncate mt-0.5">{n.description || n.content || "No description"}</p>
                    <div className="flex gap-1 mt-1">
                      <span className="bg-slate-900 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">{formatDateDisplay(n.date)}</span>
                      {n.time && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[9px] font-bold">{n.time}</span>}
                      {n.location && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[9px] font-bold">{n.location}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 self-center">
                    <button onClick={() => toggleTicker(n)} className={`w-8 h-8 rounded-lg border flex items-center justify-center transition ${n.isTicker ? "bg-red-600 text-white border-red-600" : "bg-white hover:bg-amber-100"}`} title="Add to Ticker">
                      {n.isTicker ? "✓" : "📌"}
                    </button>
                    <button onClick={() => del(n.id)} className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition">✕</button>
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