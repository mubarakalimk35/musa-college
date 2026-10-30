"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { offlinePost } from "@/lib/offlineSync";

const DEPARTMENTS = ["Administration","Ministerial Staff","Computer Science","Physics","Mathematics","Chemistry","Zoology","Economics","English","Urdu","Biology","Botany","Microbiology","Statistics"];
const DESIGNATIONS = ["Principal","Vice Principal","Professor","HOD","Associate Professor","Assistant Professor","Lecturer","Superintendent","Librarian","Accountant","Senior Clerk","Junior Clerk","Lab Assistant","Naib Qasid","Chowkidar","Mali"];

function getRank(designation: string) {
  const d = designation.toLowerCase();
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

export default function AdminFaculty() {
  const router = useRouter();
  const [activeDept, setActiveDept] = useState("All");
  const [allData, setAllData] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("Professor");
  const [department, setDepartment] = useState("Administration");
  const [loading, setLoading] = useState(true);
  const [showDepts, setShowDepts] = useState(false); // mobile drawer

  const load = async () => { 
    setLoading(true);
    try{
      const res = await fetch("/api/faculty", { cache: "no-store" }); 
      const data = await res.json(); 
      setAllData(Array.isArray(data) ? data : []); 
    }catch{} finally{ setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  
  const filteredData = allData.filter(d => activeDept === "All" ? true : d.department === activeDept).sort((a,b) => getRank(a.designation) - getRank(b.designation));
  const getCount = (d:string) => d==="All" ? allData.length : allData.filter(x=>x.department===d).length;
  
  const handleAdd = async () => { 
    if (!name.trim() || !designation) return alert("Name & Designation required!"); 
    const newItem = { id: Date.now().toString(), name: name.trim(), designation, department };
    const prev = allData;
    setAllData(prev => [...prev, newItem]);
    setName("");
    try{ await offlinePost("/api/faculty", newItem); }
    catch{ setAllData(prev); alert("Add failed"); }
  };
  
  const del = async (id: any) => { 
    if(!confirm("Delete?")) return; 
    const prev = allData;
    setAllData(prev => prev.filter(x => String(x.id) !== String(id)));
    try{ await offlinePost("/api/faculty", { id, _method: "DELETE" }); }
    catch{ setAllData(prev); alert("Delete failed"); }
  };
  
  const inputClass = "w-full mt-1.5 border-2 border-slate-200 p-3 rounded-xl text-sm bg-white text-black font-bold outline-none focus:border-black placeholder:font-normal placeholder:text-gray-400";
  
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#f8fafc] p-3 md:p-4 flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col flex-1 lg:overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin")} className="w-10 h-10 bg-white border rounded-full flex items-center justify-center hover:bg-black hover:text-white transition shrink-0">←</button>
            <h1 className="text-[18px] md:text-xl font-black text-black truncate">Faculty Manager ({allData.length})</h1>
          </div>
          {/* Mobile Department Button */}
          <button onClick={()=>setShowDepts(!showDepts)} className="lg:hidden bg-black text-white px-4 py-2 rounded-full text-[12px] font-black">Depts: {activeDept} ({getCount(activeDept)})</button>
        </div>

        {/* MOBILE: Departments Horizontal Scroll */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 shrink-0 scrollbar-none">
          {["All", ...DEPARTMENTS].map(d=>(
            <button key={d} onClick={()=>setActiveDept(d)} className={`whitespace-nowrap px-4 py-2.5 rounded-full text-[12px] font-black flex items-center gap-2 shrink-0 transition ${activeDept===d ? "bg-black text-white shadow" : "bg-white border text-black"}`}>
              {d==="All" ? "All" : d} <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeDept===d ? "bg-white/20" : "bg-black text-white"}`}>{getCount(d)}</span>
            </button>
          ))}
        </div>

        {/* MAIN GRID - Mobile: 1 column, PC: 12 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 lg:overflow-hidden">
          
          {/* Add Form - Mobile pe upar, PC pe left */}
          <div className="lg:col-span-3 bg-white rounded-2xl border p-5 flex flex-col lg:overflow-auto shrink-0">
            <h2 className="font-black text-[15px] text-black">Add Faculty</h2>
            <div className="space-y-3.5 mt-5">
              <div><label className="text-[11px] font-black uppercase tracking-wider">Name *</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Dr. Ahmed Khan" className={inputClass} /></div>
              <div><label className="text-[11px] font-black uppercase tracking-wider">Designation</label><select value={designation} onChange={e=>setDesignation(e.target.value)} className={inputClass}>{DESIGNATIONS.map(des => <option key={des} value={des}>{des}</option>)}</select></div>
              <div><label className="text-[11px] font-black uppercase tracking-wider">Department</label><select value={department} onChange={e=>setDepartment(e.target.value)} className={inputClass}>{DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
              <button onClick={handleAdd} className="w-full bg-black text-white font-black text-sm py-4 rounded-xl mt-2 hover:bg-zinc-800 transition active:scale-[0.98]">+ Add Faculty</button>
            </div>
          </div>

          {/* Faculty List - Mobile pe 1 col, PC pe 3 cols */}
          <div className="lg:col-span-6 bg-white rounded-2xl border p-4 flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
            <div className="flex justify-between items-center mb-3 shrink-0">
              <h2 className="font-black text-[14px] text-black">{activeDept} Faculty ({filteredData.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-auto flex-1 pr-1 content-start">
              {loading ? <p className="col-span-full text-center py-12 text-sm text-gray-400 font-medium animate-pulse">Loading...</p> :
               filteredData.length===0 ? <p className="col-span-full text-center py-12 text-sm text-gray-400 font-medium">No faculty in {activeDept}</p> :
               filteredData.map((f:any, index:number)=>(
                <div key={String(f.id)} className="flex flex-col gap-1 p-3.5 rounded-xl border-2 border-black transition min-h-[90px] justify-center relative bg-white hover:bg-gray-50">
                  <button onClick={()=>del(f.id)} className="absolute top-1.5 right-1.5 w-6 h-6 border border-black rounded-md text-[11px] hover:bg-red-500 hover:text-white hover:border-red-500 transition font-bold flex items-center justify-center">✕</button>
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5 bg-black text-white">{index + 1}</div>
                    <p className="text-[13px] font-black text-black leading-tight pr-6 break-words">{f.name}</p>
                  </div>
                  <p className="text-[11px] font-bold break-words ml-7 text-zinc-500">{f.designation}</p>
                  <p className="text-[10px] font-bold break-words ml-7 text-zinc-400 uppercase tracking-wide">{f.department}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Departments - PC pe right side, Mobile pe hidden (upar scroll hai) */}
          <div className="hidden lg:flex lg:col-span-3 bg-white rounded-2xl border p-4 flex-col overflow-hidden">
            <h3 className="font-black text-[12px] uppercase tracking-wider mb-3">Departments</h3>
            <div className="flex flex-col gap-2 overflow-auto flex-1">
              {["All", ...DEPARTMENTS].map(d=>(
                <button key={d} onClick={()=>setActiveDept(d)} className={`w-full text-left px-4 py-3 rounded-xl text-[13px] font-bold flex justify-between items-center shrink-0 transition ${activeDept===d ? "bg-black text-white shadow-md" : "bg-gray-50 hover:bg-gray-100 text-black"}`}>
                  <span className="truncate">{d==="All" ? "All Departments" : d}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeDept===d ? "bg-white/20 text-white" : "bg-white border text-black"}`}>{getCount(d)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}