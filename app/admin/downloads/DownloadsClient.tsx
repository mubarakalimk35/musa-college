"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { offlinePost } from "@/lib/offlineSync";

const TYPES = ["Prospectus", "Admission Form", "Scholarship Form", "FSc Time Table", "BS Time Table", "Date Sheet", "Result"] as const;
type DocType = typeof TYPES[number];
type Doc = { id: number; title: string; type: DocType; file: string; };

const getIcon = (type?: string) => {
  const t = (type || "").toLowerCase();
  if (t.includes("prospectus")) return "📘";
  if (t.includes("admission")) return "📝";
  if (t.includes("scholarship")) return "🎓";
  if (t.includes("time table")) return "🕒";
  if (t.includes("date sheet")) return "📅";
  if (t.includes("result")) return "📊";
  return "📄";
};

export default function AdminDownloads() {
  const router = useRouter();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DocType>(TYPES[0]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const res = await fetch("/api/downloads", { signal, cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch (e: any) {
      if (e.name !== "AbortError") console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, [load]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const cleanTitle = title.trim();
    if (!cleanTitle) { alert("Title is required!"); return; }
    if (cleanTitle.length > 100) { alert("Title max 100 chars"); return; }
    if (!file) return;
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) { alert("File 10MB se bara nahi ho sakta"); e.target.value = ""; return; }
    if (!navigator.onLine) { alert("File upload ke liye internet chahiye."); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const upRes = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await upRes.json();
      if (!upRes.ok || upData.error) throw new Error(upData.error || "Upload failed");
      const newId = Date.now() + Math.floor(Math.random() * 1000);
      await offlinePost("/api/downloads", { id: newId, title: cleanTitle, type, file: upData.url });
      setTitle(""); e.target.value = ""; await load();
    } catch (err: any) { alert(err.message); } finally { setUploading(false); }
  };

  const del = async (doc: Doc) => {
    if (!confirm(`Delete "${doc.title}"?`)) return;
    const prev = docs;
    setDocs(prev => prev.filter(d => d.id !== doc.id));
    try { await offlinePost("/api/downloads", { id: doc.id, _method: "DELETE" }); }
    catch { setDocs(prev); alert("Delete failed"); }
  };

  const totalLabel = useMemo(() => `${docs.length} Files`, [docs.length]);

  return (
    <div className="min-h-screen bg-white p-3 md:p-4 font-sans flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push("/admin")} className="w-10 h-10 shrink-0 bg-black text-white border-2 border-black rounded-full flex items-center justify-center font-black hover:bg-white hover:text-black">←</button>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-black text-black leading-none truncate">Downloads Manager</h1>
              <p className="text-[13px] font-black text-black mt-1">Manage all college resources</p>
            </div>
          </div>
          <div className="bg-white px-3 md:px-4 py-1.5 rounded-full border-2 border-black text-xs font-black text-black shrink-0">Total: {totalLabel}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
          <div className="md:col-span-2 bg-white rounded-2xl border-2 border-black p-4 md:p-5">
            <h2 className="font-black text-black text-lg">New Upload</h2>
            <p className="text-sm font-black text-black mb-4">Upload file from here</p>
            <div className="space-y-3">
              <div><label className="text-[11px] font-black text-black uppercase">Document Title</label><input value={title} onChange={e => setTitle(e.target.value)} maxLength={100} placeholder="Ex: BEEF Scholarship 2026" className="w-full mt-1 border-2 border-black p-3 rounded-xl text-sm bg-white text-black font-black placeholder:text-black placeholder:opacity-60 outline-none focus:ring-2 focus:ring-black" /></div>
              <div><label className="text-[11px] font-black text-black uppercase">Category</label><select value={type} onChange={e => setType(e.target.value as DocType)} className="w-full mt-1 border-2 border-black p-3 rounded-xl text-sm bg-white text-black font-black">{TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
              <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-black rounded-xl cursor-pointer py-8 hover:bg-gray-50">
                <div className="text-2xl">{uploading ? "⏳" : "📄"}</div>
                <span className="text-sm font-black text-black mt-1">{uploading ? "Uploading..." : "Click to Upload"}</span>
                <span className="text-[11px] font-bold text-black">PDF, JPG, PNG - Max 10MB</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" hidden onChange={handleUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="md:col-span-3 bg-white rounded-2xl border-2 border-black p-4 md:p-5 flex flex-col h-auto max-h-[420px]">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h2 className="font-black text-black">Uploaded Documents</h2>
            </div>
            <div className="space-y-2 overflow-auto flex-1 pr-1">
              {loading ? <div className="text-center py-6 text-black font-black text-sm">Loading...</div> : docs.length === 0 ? <div className="text-center py-6 text-black font-black text-sm">No files yet</div> : 
                docs.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-xl border-2 border-black bg-white">
                    <div className="w-10 h-10 shrink-0 bg-white border-2 border-black text-lg rounded-xl flex items-center justify-center">{getIcon(d.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-black truncate">{d.title}</p>
                      <span className="bg-white text-black border-2 border-black px-2 py-0.5 rounded-full text-[10px] font-black inline-block mt-1">{(d.type || "FILE").toUpperCase()}</span>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <a href={d.file} target="_blank" className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center text-sm font-black text-black hover:bg-gray-100">↗</a>
                      <button onClick={() => del(d)} className="w-8 h-8 bg-white border-2 border-black rounded-lg flex items-center justify-center text-sm font-black text-black hover:bg-red-50">✕</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}