"use client";
import { useState } from "react";
import Link from "next/link";

const documents = [
  { title: "BS Admission Form 2025-26", type: "Admission", size: "2.1 MB", file: "/downloads/admission-form.pdf", icon: "📄" },
  { title: "College Prospectus 2025-26", type: "Prospectus", size: "5.4 MB", file: "/downloads/prospectus.pdf", icon: "📘" },
  { title: "Fee Challan Form", type: "Fee", size: "1.2 MB", file: "/downloads/fee-challan.pdf", icon: "💳" },
  { title: "BS Exam Date Sheet 2025", type: "Exam", size: "890 KB", file: "/downloads/date-sheet.pdf", icon: "📅" },
  { title: "Scholarship Form", type: "Scholarship", size: "1.5 MB", file: "/downloads/scholarship-form.pdf", icon: "🎓" },
  { title: "Library Membership Form", type: "Library", size: "800 KB", file: "/downloads/library-form.pdf", icon: "📚" },
];

export default function DownloadsPage() {
  const [filter, setFilter] = useState("All");
  const types = ["All", ...Array.from(new Set(documents.map(d => d.type)))];
  const filtered = filter === "All" ? documents : documents.filter(d => d.type === filter);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Link href="/" className="inline-block mb-6 text-sm font-bold bg-white px-4 py-2 rounded-full shadow">← Back to Home</Link>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="text-center mb-10">
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold tracking-widest">RESOURCES</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0d2a54] mt-3">Downloads Center</h2>
            <p className="text-gray-500 text-[13px] mt-2">All important forms and documents</p>
          </div>

          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {types.map(t => (
              <button 
                key={t} 
                onClick={() => setFilter(t)} 
                className={`px-5 py-2 rounded-full text-[12px] font-bold border transition-all ${filter === t ? 'bg-[#0d2a54] text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 3 COLUMNS - same as your apply form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((doc,i) => (
              <div key={i} className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 flex gap-4 items-center hover:shadow-lg hover:border-blue-200 transition-all">
                <div className="w-14 h-14 bg-white border rounded-xl flex items-center justify-center text-2xl shadow-sm shrink-0">{doc.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-[13px] text-[#0d2a54] leading-tight truncate">{doc.title}</h4>
                  <span className="text-[11px] text-gray-500 font-medium">{doc.size} • {doc.type}</span>
                </div>
                <a href={doc.file} download className="bg-[#0d2a54] text-white px-4 py-2 rounded-full text-[11px] font-black hover:bg-blue-800 shrink-0">Download</a>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 mt-10">No documents found.</p>
          )}
        </div>
      </div>
    </main>
  );
}