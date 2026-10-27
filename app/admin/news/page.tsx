"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminNews() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"News" | "Events">("News");
  const [allData, setAllData] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/news");
    const data = await res.json();
    setAllData(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, []);

  const filteredData = allData.filter((d) => d.category === activeTab);

  const handleAdd = async () => {
    if (!title || !date) { alert("Title & Date required!"); return; }
    setUploading(true);
    await fetch("/api/news", {
      method: "POST",
      body: JSON.stringify({ 
        id: Date.now(), 
        title, 
        date, 
        description: desc,
        category: activeTab, // News ya Events
        time: activeTab === "Events" ? time : "",
        location: activeTab === "Events" ? location : "",
      }),
    });
    setTitle(""); setDate(""); setDesc(""); setTime(""); setLocation("");
    load(); setUploading(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete?")) return;
    await fetch("/api/news", { method: "DELETE", body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div className="h-screen bg-[#f8fafc] p-4 font-sans overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
        
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin")} className="w-9 h-9 bg-white border rounded-full flex items-center justify-center hover:bg-[#0f172a] hover:text-white transition shadow-sm">←</button>
            <div>
              <h1 className="text-2xl font-black text-[#0f172a] leading-none">News & Events Manager</h1>
              <p className="text-xs text-slate-500 mt-1">Manage {activeTab} - {filteredData.length} items</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="bg-white border rounded-full p-1 flex gap-1">
            <button onClick={() => setActiveTab("News")} className={`px-5 py-1.5 rounded-full text-xs font-bold transition ${activeTab==="News" ? "bg-[#0d2a54] text-white" : "text-slate-500"}`}>📰 News</button>
            <button onClick={() => setActiveTab("Events")} className={`px-5 py-1.5 rounded-full text-xs font-bold transition ${activeTab==="Events" ? "bg-green-700 text-white" : "text-slate-500"}`}>📅 Events</button>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-4 flex-1 overflow-hidden">
          {/* Add Form */}
          <div className="md:col-span-2 bg-white rounded-2xl border p-5 flex flex-col overflow-auto">
            <h2 className="font-bold text-lg text-[#0f172a]">Add {activeTab}</h2>
            <p className="text-xs text-slate-500 mb-4">Publishing to {activeTab} section</p>
            
            <div className="space-y-3">
              <div><label className="text-[10px] font-bold text-slate-400 uppercase">Title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder={activeTab==="News" ? "Ex: Admission Open 2026" : "Ex: Seminar on AI"} className="w-full mt-1 border p-3 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" /></div>
              <div><label className="text-[10px] font-bold text-slate-400 uppercase">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 border p-3 rounded-xl text-sm bg-slate-50" /></div>
              
              {activeTab === "Events" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[10px] font-bold text-slate-400 uppercase">Time</label><input value={time} onChange={e => setTime(e.target.value)} placeholder="10:00 AM" className="w-full mt-1 border p-3 rounded-xl text-sm bg-slate-50" /></div>
                    <div><label className="text-[10px] font-bold text-slate-400 uppercase">Location</label><input value={location} onChange={e => setLocation(e.target.value)} placeholder="Main Hall" className="w-full mt-1 border p-3 rounded-xl text-sm bg-slate-50" /></div>
                  </div>
                </>
              )}

              <div><label className="text-[10px] font-bold text-slate-400 uppercase">Description</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Write short description..." className="w-full mt-1 border p-3 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" /></div>
              
              <button onClick={handleAdd} disabled={uploading} className={`w-full font-bold text-sm py-3 rounded-xl transition disabled:opacity-50 mt-2 ${activeTab==="News" ? "bg-[#0d2a54] text-white" : "bg-green-700 text-white"}`}>
                {uploading ? "Publishing..." : `+ Publish to ${activeTab}`}
              </button>
            </div>
          </div>

          {/* List */}
          <div className="md:col-span-3 bg-white rounded-2xl border p-5 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h2 className="font-bold text-[#0f172a]">{activeTab} List ({filteredData.length})</h2>
              <span className={`text-[10px] px-3 py-1 rounded-full font-bold text-white ${activeTab==="News" ? "bg-[#0d2a54]" : "bg-green-700"}`}>{activeTab.toUpperCase()}</span>
            </div>
            
            <div className="space-y-2 overflow-auto flex-1 pr-1">
              {filteredData.length === 0 && <div className="text-center py-16 text-slate-400 text-sm">No {activeTab} yet. Add from left.</div>}
              {filteredData.map((n: any) => (
                <div key={n.id} className="flex gap-3 p-3 rounded-xl border hover:bg-slate-50 transition">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${activeTab==="News" ? "bg-blue-50 text-blue-700 border border-blue-100" : "bg-green-50 text-green-700 border border-green-100"}`}>{activeTab==="News" ? "📰" : "📅"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#0f172a] truncate">{n.title}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{n.description || "No description"}</p>
                    <div className="flex gap-1 mt-1">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[9px] font-bold">{n.date}</span>
                      {n.time && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[9px] font-bold">{n.time}</span>}
                      {n.location && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[9px] font-bold">{n.location}</span>}
                    </div>
                  </div>
                  <button onClick={() => del(n.id)} className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition self-center">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}