"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { offlinePost } from "@/lib/offlineSync";

const DEPARTMENTS = ["Administration","Ministerial Staff","Computer Science","Physics","Mathematics","Chemistry","Zoology","Economics","English","Urdu","Biology","Botany","Microbiology","Statistics"];
const DESIGNATIONS = ["Principal","Vice Principal","Professor","Associate Professor","Assistant Professor","Lecturer","Superintendent","Librarian","Accountant","Senior Clerk","Junior Clerk","Lab Assistant","Naib Qasid","Chowkidar","Mali"];

function getRank(designation: string) {
  const d = designation.toLowerCase();
  if (d.includes("principal") && d.includes("vice")) return 2;
  if (d.includes("principal")) return 1;
  if (d.includes("associate")) return 4;
  if (d.includes("assistant")) return 5;
  if (d.includes("lecturer") || d.includes("lecture")) return 6;
  if (d.includes("professor") || d.includes("prof")) return 3;
  if (d.includes("superintendent")) return 7;
  if (d.includes("librarian")) return 8;
  if (d.includes("accountant")) return 9;
  if (d.includes("senior clerk")) return 10;
  if (d.includes("junior clerk")) return 11;
  if (d.includes("lab assistant")) return 12;
  if (d.includes("naib qasid")) return 13;
  if (d.includes("chowkidar")) return 14;
  if (d.includes("mali")) return 15;
  return 16;
}

export default function AdminFaculty() {
  const router = useRouter();
  const [activeDept, setActiveDept] = useState("All");
  const [allData, setAllData] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("Professor");
  const [department, setDepartment] = useState("Administration");
  const load = async () => { const res = await fetch("/api/faculty"); const data = await res.json(); setAllData(Array.isArray(data) ? data : []); };
  useEffect(() => { load(); }, []);
  const filteredData = allData.filter(d => activeDept === "All" ? true : d.department === activeDept).sort((a,b) => getRank(a.designation) - getRank(b.designation));
  const getCount = (d:string) => d==="All" ? allData.length : allData.filter(x=>x.department===d).length;
  const handleAdd = async () => { 
    if (!name || !designation) return alert("Name & Designation required!"); 
    const newItem = { id: Date.now(), name, designation, department };
    await offlinePost("/api/faculty", newItem);
    setAllData(prev => [...prev, newItem]);
    setName(""); 
  };
  const del = async (id: number) => { 
    if(!confirm("Delete?")) return; 
    await offlinePost("/api/faculty", { id, _method: "DELETE" });
    setAllData(prev => prev.filter(x => x.id !== id));
  };
  const inputClass = "w-full mt-1.5 border-2 border-slate-200 p-3 rounded-xl text-sm bg-white text-black font-bold outline-none focus:border-black placeholder:font-normal placeholder:text-gray-400";
  return (
    <div className="h-screen overflow-hidden bg-[#f8fafc] p-4 flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <button onClick={() => router.push("/admin")} className="w-10 h-10 bg-white border rounded-full flex items-center justify-center hover:bg-black hover:text-white transition">←</button>
          <h1 className="text-xl font-black text-black">Faculty Manager</h1>
        </div>
        <div className="grid grid-cols-12 gap-4 flex-1 overflow-hidden">
          <div className="col-span-3 bg-white rounded-2xl border p-5 flex flex-col">
            <h2 className="font-black text-[15px] text-black">Add Faculty</h2>
            <div className="space-y-3.5 mt-5">
              <div><label className="text-[11px] font-black uppercase tracking-wider">Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Dr. Ahmed Khan" className={inputClass} /></div>
              <div><label className="text-[11px] font-black uppercase tracking-wider">Designation</label><select value={designation} onChange={e=>setDesignation(e.target.value)} className={inputClass}>{DESIGNATIONS.map(des => <option key={des} value={des}>{des}</option>)}</select></div>
              <div><label className="text-[11px] font-black uppercase tracking-wider">Department</label><select value={department} onChange={e=>setDepartment(e.target.value)} className={inputClass}>{DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
              <button onClick={handleAdd} className="w-full bg-black text-white font-black text-sm py-4 rounded-xl mt-6 hover:bg-zinc-800 transition">+ Add Faculty</button>
            </div>
          </div>
          <div className="col-span-6 bg-white rounded-2xl border p-4 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-3 shrink-0">
              <h2 className="font-black text-[14px] text-black">{activeDept} Faculty</h2>
            </div>
            <div className="grid grid-cols-3 gap-3 overflow-auto flex-1 pr-1 content-start">
              {filteredData.length===0 && <p className="col-span-3 text-center py-12 text-sm text-gray-400 font-medium">No faculty in {activeDept}</p>}
              {filteredData.map((f:any, index:number)=>{
                return (
                <div key={f.id} className="flex flex-col gap-1 p-3.5 rounded-xl border-2 border-black transition min-h-[90px] justify-center relative bg-white hover:bg-gray-50">
                  <button onClick={()=>del(f.id)} className="absolute top-1.5 right-1.5 w-5 h-5 border border-black rounded-md text-[9px] hover:bg-red-500 hover:text-white hover:border-red-500 transition font-bold flex items-center justify-center">✕</button>
                  <div className="flex gap-2 items-start">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5 bg-black text-white border border-black">{index + 1}</div>
                    <p className="text-[13px] font-black text-black leading-tight pr-5 break-words whitespace-normal">{f.name}</p>
                  </div>
                  <p className="text-[11px] font-bold break-words ml-7 text-zinc-500">{f.designation}</p>
                </div>
              )})}
            </div>
          </div>
          <div className="col-span-3 bg-white rounded-2xl border p-4 flex flex-col overflow-hidden">
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