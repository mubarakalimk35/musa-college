"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { offlinePost } from "@/lib/offlineSync";

const TYPES = ["Prospectus", "Admission Form", "Scholarship Form", "FSc Time Table", "BS Time Table", "Date Sheet", "Result"];

export default function AdminDownloads() {
  const router = useRouter();
  const [docs, setDocs] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState(TYPES[0]);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/downloads");
    const data = await res.json();
    setDocs(Array.isArray(data) ? data : []);
  };
  useEffect(() => { load(); }, []);

  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file || !title) { alert("Title is required!"); return; }
    if (!navigator.onLine) { alert("File upload ke liye internet chahiye. Bina net ke upload nahi hoga."); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const upRes = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await upRes.json();
      if (upData.error) throw new Error(upData.error);
      // Offline support
      await offlinePost("/api/downloads", { id: Date.now(), title, type, file: upData.url });
      setTitle(""); 
      await load();
    } catch (err: any) { alert(err.message); }
    setUploading(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete?")) return;
    // Offline support
    await offlinePost("/api/downloads", { id, _method: "DELETE" });
    setDocs(prev => prev.filter((d:any) => d.id !== id));
  };

  return (
    <div className="h-screen bg-[#f8fafc] p-4 font-sans overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin")}
              className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-700 font-bold hover:bg-[#0f172a] hover:text-white transition-all shadow-sm"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-black text-[#0f172a] leading-none">Downloads Manager</h1>
              <p className="text-xs text-slate-500 mt-1">Manage all college resources</p>
            </div>
          </div>
          <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold">Total: <span className="text-emerald-600">{docs.length} Files</span></div>
        </div>

        <div className="grid md:grid-cols-5 gap-4 flex-1 overflow-hidden">
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col">
            <h2 className="font-bold text-[#0f172a] text-lg">New Upload</h2>
            <p className="text-xs text-slate-500 mb-4">Upload file from here</p>
            <div className="space-y-3">
              <div><label className="text-[10px] font-bold text-slate-400 uppercase">Document Title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: BEEF Scholarship 2026" className="w-full mt-1 border border-slate-200 p-3 rounded-xl text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" /></div>
              <div><label className="text-[10px] font-bold text-slate-400 uppercase">Category</label><select value={type} onChange={e => setType(e.target.value)} className="w-full mt-1 border border-slate-200 p-3 rounded-xl text-sm bg-slate-50 font-semibold">{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
              
              <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer mt-3 py-9 ${uploading ? 'bg-slate-50' : 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50'}`}>
                <div className="text-2xl">📄</div>
                <span className="text-sm font-bold text-[#0f172a] mt-1">{uploading ? "Uploading..." : "Click to Upload"}</span>
                <span className="text-[10px] text-slate-500 font-medium">PDF, JPG, JPEG, PNG</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" hidden onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="md:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3 shrink-0"><h2 className="font-bold text-[#0f172a]">Uploaded Documents</h2><span className="text-[10px] bg-slate-900 text-white px-3 py-1 rounded-full font-bold">{TYPES.length} Categories</span></div>
            <div className="space-y-2 overflow-auto flex-1 pr-1">
              {docs.length === 0 && <div className="text-center py-10 text-slate-400 text-sm">No files yet</div>}
              {docs.map((d: any) => (<div key={d.id} className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50"><div className="w-9 h-9 bg-[#0f172a] text-white rounded-lg flex items-center justify-center text-xs font-black">{d.type[0]}</div><div className="flex-1 min-w-0"><p className="text-sm font-bold text-[#0f172a] truncate">{d.title}</p><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold">{d.type.toUpperCase()}</span></div><div className="flex gap-1"><a href={d.file} target="_blank" className="w-7 h-7 bg-white border rounded-lg flex items-center justify-center text-xs hover:bg-[#0f172a] hover:text-white">↗</a><button onClick={() => del(d.id)} className="w-7 h-7 bg-white border rounded-lg flex items-center justify-center text-xs hover:bg-red-500 hover:text-white">✕</button></div></div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}