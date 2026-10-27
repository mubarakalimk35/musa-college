"use client";
import { useState, useEffect } from "react";

const FILTERS = ["All","Prospectus","Admission Form","Scholarship Form","FSc Time Table","BS Time Table","Date Sheet","Result"];

const getTypeIcon = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("prospectus")) return "📘";
  if (t.includes("admission")) return "📄";
  if (t.includes("scholarship")) return "🎓";
  if (t.includes("fsc")) return "⏰";
  if (t.includes("bs")) return "📚";
  if (t.includes("date")) return "📅";
  if (t.includes("result")) return "🏆";
  return "📁";
};

export default function DownloadsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/downloads", { cache: "no-store" });
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, []);

  const filtered = docs.filter((d: any) => filter === "All" || d.type.toLowerCase() === filter.toLowerCase());

  // Direct Download Function
  const handleDownload = async (url: string, title: string) => {
    try {
      setDownloading(title);
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = title + "." + (url.split(".").pop() || "pdf");
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // fallback - direct link
      window.location.href = url;
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="h-screen bg-[#eef2ff] font-sans p-3 flex flex-col overflow-hidden">
      <div className="max-w-7xl w-full mx-auto bg-white rounded-[26px] shadow-xl shadow-indigo-100 border border-white flex flex-col h-full overflow-hidden">
        
        <div className="px-8 py-5 shrink-0 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e3a8a] text-white">
          <div className="flex justify-between items-center">
            <a href="/" className="text-[12px] font-bold bg-white/10 border border-white/20 text-white rounded-full px-5 py-2 hover:bg-white hover:text-[#0f172a] transition">← Back to Home</a>
            <span className="text-[12px] font-bold bg-emerald-500 text-white px-4 py-1.5 rounded-full">{filtered.length} Files Available</span>
          </div>
          <div className="text-center mt-3">
            <h1 className="text-[34px] font-black tracking-tight leading-none">Downloads Center</h1>
            <p className="text-[13px] text-indigo-200 mt-1.5 font-medium">All important forms and documents at one place.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5 mt-5">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-[12px] font-bold border transition-all ${filter===f ? "bg-white text-[#0f172a] border-white shadow-lg scale-105" : "bg-white/10 text-white border-white/20 hover:bg-white/20"}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-5 bg-[#f8fafc] overflow-auto">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
              <p className="font-bold text-slate-700 text-[14px]">No documents in {filter}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
              {filtered.map((doc: any) => (
                <div key={doc.id} className="bg-white rounded-[16px] border border-slate-200 p-4 flex items-center gap-4 hover:border-indigo-300 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-[12px] bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-[20px] shrink-0">{getTypeIcon(doc.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[13.5px] text-[#0f172a] truncate">{doc.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{doc.type}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(doc.file, doc.title)}
                    disabled={downloading === doc.title}
                    className="shrink-0 bg-[#1e3a8a] text-white text-[11px] font-bold px-5 py-2 rounded-full hover:bg-[#0f172a] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {downloading === doc.title ? "..." : "Download"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}