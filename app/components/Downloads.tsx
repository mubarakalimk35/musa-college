"use client";
import { useState } from "react";
const documents = [
  { title: "BS Admission Form 2025-26", type: "Admission", size: "2.1 MB", file: "/downloads/admission-form.pdf", icon: "📄" },
  { title: "College Prospectus 2025-26", type: "Prospectus", size: "5.4 MB", file: "/downloads/prospectus.pdf", icon: "📘" },
  { title: "Fee Challan Form", type: "Fee", size: "1.2 MB", file: "/downloads/fee-challan.pdf", icon: "💳" },
  { title: "BS Exam Date Sheet 2025", type: "Exam", size: "890 KB", file: "/downloads/date-sheet.pdf", icon: "📅" },
  { title: "Scholarship Form", type: "Scholarship", size: "1.5 MB", file: "/downloads/scholarship-form.pdf", icon: "🎓" },
  { title: "Library Membership Form", type: "Library", size: "800 KB", file: "/downloads/library-form.pdf", icon: "📚" },
];
export default function Downloads() {
  const [filter, setFilter] = useState("All");
  const types = ["All", ...Array.from(new Set(documents.map(d => d.type)))];
  const filtered = filter === "All" ? documents : documents.filter(d => d.type === filter);
  return (
    <section id="downloads" className="px-6 md:px-20 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10"><span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold">RESOURCES</span><h2 className="text-3xl font-black text-[#0d2a54] mt-3">Downloads</h2></div>
        <div className="flex gap-2 flex-wrap justify-center mb-8">{types.map(t => (<button key={t} onClick={() => setFilter(t)} className={`px-4 py-1.5 rounded-full text-[12px] font-bold border ${filter === t ? 'bg-[#0d2a54] text-white' : 'bg-white text-gray-600'}`}>{t}</button>))}</div>
        <div className="grid md:grid-cols-2 gap-4">{filtered.map((doc,i) => (<div key={i} className="bg-gray-50 border rounded-2xl p-4 flex gap-4 items-center hover:shadow-md"><div className="w-12 h-12 bg-white border rounded-xl flex items-center justify-center text-xl">{doc.icon}</div><div className="flex-1"><h4 className="font-black text-[13px] text-[#0d2a54]">{doc.title}</h4><span className="text-[10px] text-gray-400">{doc.size} • {doc.type}</span></div><a href={doc.file} download className="bg-[#0d2a54] text-white px-4 py-2 rounded-full text-[11px] font-black">Download</a></div>))}</div>
      </div>
    </section>
  );
}