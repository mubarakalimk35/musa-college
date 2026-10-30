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
    e.target.value = "";
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

  if (loading) return <div className="p-10 font-black text-black animate-pulse">Loading Home Settings...</div>;

  const combinedView = getCombinedSorted();

  return (
    <div className="p-3 md:p-4 bg-white min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={()=>router.push("/admin")} className="bg-black text-white border-2 border-black w-10 h-10 rounded-full flex items-center justify-center font-black text-sm hover:bg-white hover:text-black transition shrink-0">←</button>
          <h1 className="text-[18px] md:text-xl font-black text-black truncate">Manage Home Page</h1>
          <span className="ml-auto text-[11px] bg-white border-2 border-black px-3 py-1.5 rounded-full font-black text-black shrink-0">{combinedView.length}/16 Slides • {extraSlides.length}/10 Extra</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.4fr] gap-3 md:gap-4">
          <div className="bg-white rounded-2xl border-2 border-black p-3 md:p-4">
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-center mb-4">
              <h2 className="font-black text-black text-[14px]">Hero Slider - Total {combinedView.length}/16</h2>
            </div>

            {/* NOTE BOX KHATAM - Sirf upload button full width */}
            <div className="mb-4">
              <div className="border-2 border-dashed border-black rounded-2xl p-4 text-center bg-white">
                <p className="font-black text-sm text-black">Upload Extra Images</p>
                <label className="mt-2 inline-block bg-black text-white border-2 border-black px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer hover:bg-white hover:text-black transition">
                  {uploading ? "Uploading..." : `Select & Upload (${extraSlides.length}/10)`}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleMultiUpload} disabled={uploading} />
                </label>
                <p className="text-[11px] text-black font-bold mt-1.5">Max 10 extra • 8MB each</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-[11px] font-black uppercase tracking-wider text-black">Live Order Preview - {combinedView.length} Slides:</p>
              <button onClick={handleSave} className="bg-black text-white border-2 border-black font-black px-5 py-2 rounded-xl text-xs shrink-0 hover:bg-white hover:text-black active:scale-[0.98] transition">Save & Publish</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-[65vh] overflow-y-auto pr-1">
              {combinedView.map((s:any, idx:number)=>(
                <div key={String(s.id)} className="border-2 border-black rounded-xl p-2 flex flex-col gap-2 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black bg-black text-white w-6 h-6 flex items-center justify-center rounded-full">{idx+1}</span>
                    {s.isDefault ? <span className="text-[8px] bg-white text-black border-2 border-black px-1.5 py-0.5 rounded-full font-black">LOCK</span> : <span className="text-[8px] bg-white text-black border-2 border-black px-1.5 py-0.5 rounded-full font-black">EXTRA</span>}
                  </div>
                  <img src={s.image} className="h-20 md:h-16 w-full object-cover rounded-lg border-2 border-black bg-white" alt="" loading="lazy" />
                  {!s.isDefault && (
                    <div className="flex flex-col gap-1.5">
                      <select value={idx+1} onChange={(e)=>setPosition(s.id, parseInt(e.target.value))} className="text-[11px] border-2 border-black rounded-lg px-1.5 py-1.5 font-black w-full bg-white text-black outline-none">
                        {Array.from({length: combinedView.length}, (_,i)=>i+1).map(n=>(<option key={n} value={n}>Position {n}</option>))}
                      </select>
                      <div className="flex gap-1">
                        <button onClick={()=>setExtraSlides(prev=>{ const c=[...prev]; const i=c.findIndex(x=>String(x.id)===String(s.id)); if(i>0){ const t=c[i].order; c[i].order=c[i-1].order; c[i-1].order=t;} return [...c].sort((a,b)=>a.order-b.order); })} className="flex-1 text-[11px] bg-white border-2 border-black px-1 py-1.5 rounded-lg font-black text-black hover:bg-black hover:text-white">↑</button>
                        <button onClick={()=>setExtraSlides(prev=>{ const c=[...prev]; const i=c.findIndex(x=>String(x.id)===String(s.id)); if(i<c.length-1){ const t=c[i].order; c[i].order=c[i+1].order; c[i+1].order=t;} return [...c].sort((a,b)=>a.order-b.order); })} className="flex-1 text-[11px] bg-white border-2 border-black px-1 py-1.5 rounded-lg font-black text-black hover:bg-black hover:text-white">↓</button>
                        <button onClick={()=>setExtraSlides(extraSlides.filter(ex=>String(ex.id)!==String(s.id)))} className="flex-1 text-[11px] bg-white text-black border-2 border-black px-1 py-1.5 rounded-lg font-black hover:bg-black hover:text-white">X</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {saved && <p className="text-black text-xs font-black text-center mt-3 bg-white border-2 border-black py-2 rounded-xl">{offlineMsg ? "Offline Saved! Will publish when online." : "✅ Saved Successfully!"}</p>}
          </div>

          <div className="bg-white rounded-2xl border-2 border-black p-4 h-fit">
            <h2 className="font-black text-black text-[14px] mb-3">Stats - 4 Items</h2>
            <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5">
              {stats.map((s:any, i:number)=>(
                <div key={s.id} className="border-2 border-black rounded-xl p-2.5 bg-white">
                  <input className="w-full border-2 border-black rounded-xl px-2 py-2.5 text-[15px] font-black text-black outline-none text-center bg-white" value={s.value} onChange={e=>{let ns=[...stats]; ns[i]={...ns[i], value:e.target.value}; setStats(ns)}} />
                  <input className="w-full border-2 border-black rounded-lg px-2 py-2 text-[11px] font-black outline-none mt-2 text-center bg-white text-black" value={s.label} onChange={e=>{let ns=[...stats]; ns[i]={...ns[i], label:e.target.value}; setStats(ns)}} />
                </div>
              ))}
            </div>
            {/* FIX: Black box white kar diya */}
            <div className="mt-3 bg-white text-black border-2 border-black rounded-xl p-3 text-center">
              <p className="text-[11px] font-black tracking-wider leading-relaxed text-black">{stats.map((s:any)=>`${s.value} ${s.label}`).join(' • ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}