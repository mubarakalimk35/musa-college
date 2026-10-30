"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const depts = [
  "Administration","Ministerial Staff","Computer Science","Physics","Mathematics",
  "Chemistry","Zoology","Economics","English","Urdu","Biology","Botany","Microbiology","Statistics"
];

function getRank(designation: string) {
  const d = (designation || "").toLowerCase();
  if (d.includes("principal") && d.includes("vice")) return 2;
  if (d.includes("principal")) return 1;
  if (d.includes("hod")) return 3;
  if (d.includes("professor") || d.includes("prof")) return 4;
  if (d.includes("associate")) return 5;
  if (d.includes("assistant")) return 6;
  if (d.includes("lecturer") || d.includes("lecture")) return 7;
  if (d.includes("superintendent")) return 8;
  if (d.includes("librarian")) return 9;
  if (d.includes("accountant")) return 10;
  if (d.includes("senior clerk")) return 11;
  if (d.includes("junior clerk")) return 12;
  if (d.includes("lab assistant")) return 13;
  if (d.includes("naib qasid")) return 14;
  if (d.includes("chowkidar")) return 15;
  if (d.includes("mali")) return 16;
  return 17;
}

export default function FacultyPage() {
  const [selected, setSelected] = useState<any>(null);
  const [allFaculty, setAllFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/faculty", { cache: "no-store" })
      .then(r=>r.json())
      .then(d=>{ if(Array.isArray(d)) setAllFaculty(d); setLoading(false); })
      .catch(()=>setLoading(false));
  }, []);

  const getCount = (dept:string) => allFaculty.filter(f=>f.department===dept).length;
  const getTeachers = (dept:string) => allFaculty.filter(f=>f.department===dept).sort((a,b)=> getRank(a.designation) - getRank(b.designation));

  if (selected) {
    return (
      <main className="min-h-screen bg-[#f8fafc] p-3 md:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 gap-2">
            <button onClick={()=>setSelected(null)} className="text-[13px] bg-white border px-4 py-2.5 rounded-full shadow-sm font-bold text-black hover:bg-black hover:text-white transition shrink-0">← Back</button>
            <div className="text-center flex-1 min-w-0">
              <h1 className="text-[18px] md:text-2xl font-black text-black leading-tight truncate px-2">{selected.dept}</h1>
              <p className="text-[11px] md:text-xs text-gray-500 mt-1 font-medium">{selected.teachers.length} Faculty Members</p>
            </div>
            <div className="w-[70px] md:w-[88px] shrink-0" />
          </div>
          <div className="bg-white rounded-2xl border p-3 md:p-5 shadow-sm">
            {selected.teachers.length===0 ? (
              <p className="text-center text-gray-400 py-16 text-sm font-medium">No faculty added yet<br/><span className="text-xs">Add from Admin Panel</span></p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {selected.teachers.map((t:any,i:number)=>(
                  <div key={String(t.id || i)} className="flex items-center gap-3 bg-white border-2 border-black rounded-xl p-4 active:scale-[0.98] transition">
                    <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-[13px] text-black leading-tight break-words">{t.name}</p>
                      <p className="text-[11px] text-gray-600 font-bold mt-0.5">{t.designation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] p-3 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 gap-2">
          <Link href="/" className="text-[13px] bg-white border px-4 py-2.5 rounded-full shadow-sm font-bold text-black hover:bg-black hover:text-white transition shrink-0">← Back</Link>
          <div className="text-center flex-1 min-w-0">
            <h1 className="text-[20px] md:text-2xl font-black text-black leading-none">Our Faculty</h1>
            <p className="text-[11px] md:text-xs text-gray-500 mt-1 font-medium">{loading ? "Loading..." : `${allFaculty.length} Members • ${depts.length} Departments`}</p>
          </div>
          <div className="w-[70px] md:w-[88px] shrink-0" />
        </div>

        <div className="bg-white rounded-2xl border p-3 md:p-5 shadow-sm">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {[...Array(8)].map((_,i)=><div key={i} className="h-[132px] bg-gray-50 animate-pulse rounded-2xl border"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {depts.map(name=>(
                <div key={name} onClick={()=>setSelected({dept:name, teachers:getTeachers(name)})} 
                  className="border-2 border-gray-100 rounded-2xl p-5 cursor-pointer transition flex flex-col justify-between h-[110px] md:h-[132px] hover:border-black hover:bg-[#f8fafc] active:scale-[0.98]">
                  <h3 className="font-black text-[14px] md:text-[15px] leading-tight text-black">{name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-[12px] font-bold text-gray-500">{getCount(name)} Members</p>
                    <span className="text-[11px] font-black px-3 py-1 rounded-full text-black bg-gray-100 group-hover:bg-black group-hover:text-white">View</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}