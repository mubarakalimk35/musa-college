"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { offlinePost } from "@/lib/offlineSync";

const DEFAULT_SLIDES = [
  { id: 'default-1', image: '/hero1.jpeg', isDefault: true, order: 1 },
  { id: 'default-2', image: '/hero2.jpeg', isDefault: true, order: 2 },
  { id: 'default-3', image: '/hero3.jpeg', isDefault: true, order: 3 },
  { id: 'default-4', image: '/hero4.jpeg', isDefault: true, order: 4 },
  { id: 'default-5', image: '/hero5.jpeg', isDefault: true, order: 5 },
  { id: 'default-6', image: '/hero6.jpeg', isDefault: true, order: 6 },
];

export default function AdminHomePage() {
  const router = useRouter();
  const [extraSlides, setExtraSlides] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { id: 1, label: "Students", value: "5000+" },
    { id: 2, label: "Faculty", value: "50+" },
    { id: 3, label: "Programs", value: "9" },
    { id: 4, label: "Established", value: "1987" },
  ]);
  const [saved, setSaved] = useState(false);
  const [offlineMsg, setOfflineMsg] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/home", { cache: "no-store" }).then(r=>r.json()).then(d=>{
      if(d?.hero) {
        let extra = d.hero.filter((h:any)=>!h.isDefault);
        extra = extra.map((s:any, idx:number)=> ({...s, order: Number(s.order) || 7 + idx, isDefault: false }));
        setExtraSlides(extra.sort((a:any,b:any)=>a.order-b.order));
      }
      if(Array.isArray(d?.stats) && d.stats.length===4) setStats(d.stats);
      setLoading(false);
    }).catch(()=>setLoading(false));
  }, []);

  const handleMultiUpload = async (e: any) => {
    const files = Array.from(e.target.files) as File[];
    e.target.value = ""; // reset input
    if(files.length === 0) return;
    if(extraSlides.length + files.length > 10){
      alert("Maximum 10 extra images allowed!"); return;
    }
    if (!navigator.onLine) { alert("Internet required for upload."); return; }
    setUploading(true);
    const uploaded: any[] = [];
    try{
      for(const file of files){
        if(file.size > 8*1024*1024){ alert(`${file.name} > 8MB skipped`); continue; }
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd, cache: 'no-store' });
        const data = await res.json().catch(()=>null);
        if(!res.ok || !data) continue;
        const url = data.url || data.fileUrl || data.path || data.secure_url || "";
        if(url){
          uploaded.push({ id: `extra-${Date.now()}-${uploaded.length}`, image: url, order: 7 + extraSlides.length + uploaded.length, isDefault: false });
        }
      }
      setExtraSlides(prev=>[...prev, ...uploaded]);
    } finally {
      setUploading(false);
    }
  };

  const getCombinedSorted = () => {
    return [...DEFAULT_SLIDES, ...extraSlides].sort((a,b)=> a.order - b.order);
  };

  const reindex = (arr:any[]) => {
    const sorted = [...arr].sort((a,b)=>a.order-b.order);
    sorted.forEach((s, idx) => s.order = idx + 1);
    return sorted;
  };

  const setPosition = (extraId: any, newPos: number) => {
    const all = reindex([...DEFAULT_SLIDES, ...extraSlides]);
    const moving = all.find(s=>String(s.id)===String(extraId));
    if(!moving) return;
    const filtered = all.filter(s=>String(s.id)!==String(extraId));
    filtered.splice(Math.max(0, Math.min(newPos-1, filtered.length)), 0, moving);
    filtered.forEach((s, idx) => s.order = idx + 1);
    setExtraSlides(filtered.filter(s=>!s.isDefault));
  };

  const handleSave = async () => {
    const sorted = [...extraSlides].sort((a,b)=> a.order - b.order);
    const res: any = await offlinePost("/api/home", { hero: sorted, stats });
    if(res?.ok || res?.offline){
      setSaved(true);
      setOfflineMsg(!!res.offline);
      setTimeout(()=>{setSaved(false); setOfflineMsg(false)}, 3000);
    } else {
      alert("Save failed")
    }
  };

  if (loading) return <div className="p-10 font-black animate-pulse">Loading Home Settings...</div>;

  const combinedView = getCombinedSorted();

  return (
    <div className="p-3 md:p-4 bg-[#f8fafc] min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={()=>router.push("/admin")} className="bg-white border w-10 h-10 rounded-full flex items-center justify-center font-black text-sm hover:bg-black hover:text-white transition shrink-0">←</button>
          <h1 className="text-[18px] md:text-xl font-black text-[#0d2a54] truncate">Manage Home Page</h1>
          <span className="ml-auto text-[10px] md:text-[11px] bg-white border px-3 py-1.5 rounded-full font-black shrink-0">{combinedView.length}/16 Slides • {extraSlides.length}/10 Extra</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.4fr] gap-3 md:gap-4">
          <div className="bg-white rounded-2xl shadow-sm border p-3 md:p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center mb-4">
              <h2 className="font-black text-[#0d2a54] text-[14px]">Hero Slider - Total {combinedView.length}/16</h2>
              <button onClick={handleSave} className="bg-[#0d2a54] text-white font-black px-6 py-2.5 rounded-xl text-xs w-full sm:w-auto active:scale-[0.98] transition">Save & Publish</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="border-2 border-dashed rounded-2xl p-4 text-center bg-gray-50">
                <p className="font-black text-xs">Upload Extra Images</p>
                <label className="mt-2 inline-block bg-[#0d2a54] text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer hover:bg-black transition">
                  {uploading ? "Uploading..." : `Select & Upload (${extraSlides.length}/10)`}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleMultiUpload} disabled={uploading} />
                </label>
                <p className="text-[10px] text-gray-400 mt-1.5 font-medium">Max 10 extra • 8MB each</p>
              </div>
              <div className="text-[11px] text-[#0d2a54] bg-blue-50 border border-blue-100 p-3 rounded-2xl font-bold leading-relaxed">
                <span className="font-black">Note:</span> 6 Default fixed (Lock). You can add 10 extra, drag to position 1-16. Extra = Green.
              </div>
            </div>

            <p className="text-[11px] font-black mb-2 uppercase tracking-wider text-gray-500">Live Order Preview - {combinedView.length} Slides:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-[65vh] overflow-y-auto pr-1">
              {combinedView.map((s:any, idx:number)=>(
                <div key={String(s.id)} className={`border-2 rounded-xl p-2 flex flex-col gap-2 transition ${s.isDefault ? 'bg-white border-gray-100' : 'bg-green-50 border-green-300 shadow-sm'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black bg-[#0d2a54] text-white w-6 h-6 flex items-center justify-center rounded-full">{idx+1}</span>
                    {s.isDefault ? <span className="text-[8px] bg-gray-100 border px-1.5 py-0.5 rounded-full font-black">LOCK</span> : <span className="text-[8px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-black">EXTRA</span>}
                  </div>
                  <img src={s.image} className="h-20 md:h-16 w-full object-cover rounded-lg border bg-gray-100" alt="" loading="lazy" />
                  {!s.isDefault && (
                    <div className="flex flex-col gap-1.5">
                      <select value={idx+1} onChange={(e)=>setPosition(s.id, parseInt(e.target.value))} className="text-[11px] border-2 rounded-lg px-1.5 py-1.5 font-black w-full bg-white focus:border-black outline-none">
                        {Array.from({length: combinedView.length}, (_,i)=>i+1).map(n=>(<option key={n} value={n}>Position {n}</option>))}
                      </select>
                      <div className="flex gap-1">
                        <button onClick={()=>setExtraSlides(prev=>{ const c=[...prev]; const i=c.findIndex(x=>String(x.id)===String(s.id)); if(i>0){ const t=c[i].order; c[i].order=c[i-1].order; c[i-1].order=t;} return [...c].sort((a,b)=>a.order-b.order); })} className="flex-1 text-[11px] bg-white border-2 px-1 py-1.5 rounded-lg font-black hover:bg-black hover:text-white">↑</button>
                        <button onClick={()=>setExtraSlides(prev=>{ const c=[...prev]; const i=c.findIndex(x=>String(x.id)===String(s.id)); if(i<c.length-1){ const t=c[i].order; c[i].order=c[i+1].order; c[i+1].order=t;} return [...c].sort((a,b)=>a.order-b.order); })} className="flex-1 text-[11px] bg-white border-2 px-1 py-1.5 rounded-lg font-black hover:bg-black hover:text-white">↓</button>
                        <button onClick={()=>setExtraSlides(extraSlides.filter(ex=>String(ex.id)!==String(s.id)))} className="flex-1 text-[11px] bg-red-600 text-white px-1 py-1.5 rounded-lg font-black hover:bg-red-700">X</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {saved && <p className="text-green-600 text-xs font-black text-center mt-3 bg-green-50 border border-green-200 py-2 rounded-xl">{offlineMsg ? "Offline Saved! Will publish when online." : "✅ Saved Successfully!"}</p>}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4 h-fit">
            <h2 className="font-black text-[#0d2a54] text-[14px] mb-3">Stats - 4 Items</h2>
            <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5">
              {stats.map((s:any, i:number)=>(
                <div key={s.id} className="border-2 border-gray-100 rounded-xl p-2.5 bg-gray-50/50">
                  <input className="w-full border-2 border-white focus:border-[#0d2a54] shadow-sm rounded-xl px-2 py-2.5 text-[15px] font-black text-[#0d2a54] outline-none text-center bg-white" value={s.value} onChange={e=>{let ns=[...stats]; ns[i]={...ns[i], value:e.target.value}; setStats(ns)}} />
                  <input className="w-full border rounded-lg px-2 py-2 text-[11px] font-bold outline-none mt-2 text-center focus:border-black bg-white" value={s.label} onChange={e=>{let ns=[...stats]; ns[i]={...ns[i], label:e.target.value}; setStats(ns)}} />
                </div>
              ))}
            </div>
            <div className="mt-3 bg-[#0d2a54] text-white rounded-xl p-3 text-center">
              <p className="text-[10px] font-black tracking-wider leading-relaxed">{stats.map((s:any)=>`${s.value} ${s.label}`).join(' • ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}