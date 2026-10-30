"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const FILTERS = ["All","Prospectus","Admission Form","Scholarship Form","FSc Time Table","BS Time Table","Date Sheet","Result"] as const;

type DocItem = {
  id: string;
  title: string;
  type: string;
  file: string;
};

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
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/downloads", { cache: "no-store" });
        const data = await res.json();
        setDocs(Array.isArray(data) ? data : data?.data || []);
      } catch {
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = docs.filter((d) => filter === "All" || d.type.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#eef2ff] font-sans p-3">
      <div className="max-w-7xl w-full mx-auto bg-white rounded-[26px] shadow-xl shadow-indigo-100 border border-white overflow-hidden">
        
        <div className="px-8 py-5 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e3a8a] text-white">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-[12px] font-bold bg-white/10 border border-white/20 text-white rounded-full px-5 py-2 hover:bg-white hover:text-[#0f172a] transition">← Back to Home</Link>
            <span className="text-[12px] font-bold bg-emerald-500 text-white px-4 py-1.5 rounded-full">{filtered.length} Files</span>
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

        <div className="p-5 bg-[#f8fafc]">
          {loading ? (
            <div className="text-center py-12 text-slate-400 animate-pulse">Loading documents...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
              <p className="font-bold text-slate-700 text-[14px]">No documents in {filter}</p>
              <p className="text-[12px] text-slate-400 mt-1">Admin panel se add karein: /admin/downloads</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((doc) => (
                <div key={doc.id} className="bg-white rounded-[16px] border border-slate-200 p-4 flex items-center gap-4 hover:border-indigo-300 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-[12px] bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-[20px] shrink-0">{getTypeIcon(doc.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[13.5px] text-[#0f172a] truncate" title={doc.title}>{doc.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{doc.type}</p>
                  </div>
                  <a
                    href={doc.file}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 bg-[#1e3a8a] text-white text-[11px] font-bold px-5 py-2 rounded-full hover:bg-[#0f172a] hover:scale-105 active:scale-95 transition-all text-center"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}