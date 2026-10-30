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
  const [designation, setDesignation] = useState("Lecturer");
  const [additionalDesignation, setAdditionalDesignation] = useState("None");
  const [department, setDepartment] = useState("Administration");
  const [hodDepartment, setHodDepartment] = useState("Physics");
  const [loading, setLoading] = useState(true);

  // ✅ FIXED LOAD FUNCTION - OFFLINE CACHE ADDED
  const load = async () => { 
    setLoading(true);
    try{
      const res = await fetch("/api/faculty", { cache: "no-store" }); 
      if(!res.ok) throw new Error("offline");
      const data = await res.json(); 
      const list = Array.isArray(data) ? data : [];
      setAllData(list); 
      // Online data ko save kar lo
      localStorage.setItem("faculty_cache", JSON.stringify(list));
    }catch{
      // Net nahi to cache se dikhao
      const cached = localStorage.getItem("faculty_cache");
      if(cached){
        try{
          setAllData(JSON.parse(cached));
        }catch{}
      }
    } finally{ setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  
  const filteredData = allData.filter(d => activeDept === "All" ? true : d.department === activeDept || d.designation.includes(activeDept)).sort((a,b) => getRank(a.designation) - getRank(b.designation));
  const getCount = (d:string) => d==="All" ? allData.length : allData.filter(x=>x.department===d || x.designation.includes(d)).length;
  
  const handleAdd = async () => { 
    if (!name.trim() || !designation) return alert("Name & Designation required!"); 
    let finalDesignation = designation;
    if(designation === "HOD"){
      finalDesignation = `HOD ${department}`;
    }
    if(additionalDesignation && additionalDesignation !== "None" && additionalDesignation !== designation){
      if(additionalDesignation === "HOD"){
        finalDesignation = `${finalDesignation} / HOD ${hodDepartment}`;
      } else {
        finalDesignation = `${finalDesignation} / ${additionalDesignation}`;
      }
    }
    const cleanName = name.trim();
    const existingIndex = allData.findIndex(x => x.name.toLowerCase() === cleanName.toLowerCase());
    if(existingIndex !== -1){
      const existing = allData[existingIndex];
      if(existing.designation.toLowerCase() === finalDesignation.toLowerCase()){
        alert(`${cleanName} already exists!`);
        return;
      }
      const mergedDesignation = `${existing.designation} & ${finalDesignation}`;
      const updated = [...allData];
      updated[existingIndex] = { ...existing, designation: mergedDesignation };
      setAllData(updated);
      localStorage.setItem("faculty_cache", JSON.stringify(updated));
      setName("");
      setAdditionalDesignation("None");
      try{ await offlinePost("/api/faculty", updated[existingIndex]); }catch{}
      return;
    }
    const newItem = { id: Date.now().toString(), name: cleanName, designation: finalDesignation, department };
    const newList = [...allData, newItem];
    setAllData(newList);
    localStorage.setItem("faculty_cache", JSON.stringify(newList));
    setName("");
    setAdditionalDesignation("None");
    try{ await offlinePost("/api/faculty", newItem); }
    catch{ 
      setAllData(prev => prev.filter(x=>x.id !== newItem.id));
    }
  };
  
  const del = async (id: any) => { 
    if(!confirm("Delete?")) return; 
    const prev = allData;
    const newList = prev.filter(x => String(x.id) !== String(id));
    setAllData(newList);
    localStorage.setItem("faculty_cache", JSON.stringify(newList));
    try{ await offlinePost("/api/faculty", { id, _method: "DELETE" }); }
    catch{ setAllData(prev); }
  };
  
  const inputClass = "w-full mt-1.5 border-2 border-black p-3 rounded-xl text-sm bg-white text-black font-black outline-none placeholder:text-black placeholder:opacity-60";
  
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-white p-3 md:p-4 flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col flex-1 lg:overflow-hidden">
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <button onClick={() => router.push("/admin")} className="w-10 h-10 bg-black text-white border-2 border-black rounded-full flex items-center justify-center font-black hover:bg-white hover:text-black transition shrink-0">←</button>
          <h1 className="text-[18px] md:text-xl font-black text-black truncate">Faculty Manager</h1>
        </div>
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 shrink-0">
          {["All", ...DEPARTMENTS].map(d=>(
            <button key={d} onClick={()=>setActiveDept(d)} className={`whitespace-nowrap px-4 py-2.5 rounded-full text-[12px] font-black border-2 border-black ${activeDept===d ? "bg-black text-white" : "bg-white text-black"}`}>{d} ({getCount(d)})</button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 lg:overflow-hidden">
          <div className="lg:col-span-3 bg-white rounded-2xl border-2 border-black p-5 flex flex-col lg:overflow-auto shrink-0">
            <h2 className="font-black text-[15px] text-black">Add Faculty</h2>
            <div className="space-y-3.5 mt-5">
              <div><label className="text-[11px] font-black uppercase text-black">Name *</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Prof. Ali" className={inputClass} /></div>
              <div><label className="text-[11px] font-black uppercase text-black">Primary Role</label><select value={designation} onChange={e=>setDesignation(e.target.value)} className={inputClass}>{DESIGNATIONS.map(des => <option key={des} value={des}>{des}</option>)}</select></div>
              <div><label className="text-[11px] font-black uppercase text-black">Main Department</label><select value={department} onChange={e=>setDepartment(e.target.value)} className={inputClass}>{DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
              <div className="border-2 border-black rounded-xl p-3 bg-white">
                <label className="text-[11px] font-black uppercase text-black">Additional Role (Optional)</label>
                <select value={additionalDesignation} onChange={e=>setAdditionalDesignation(e.target.value)} className={inputClass}>
                  <option value="None">None</option>
                  {DESIGNATIONS.map(des => <option key={des} value={des}>{des}</option>)}
                </select>
                {additionalDesignation === "HOD" && (
                  <div className="mt-3">
                    <label className="text-[11px] font-black uppercase text-black">HOD of Which Dept?</label>
                    <select value={hodDepartment} onChange={e=>setHodDepartment(e.target.value)} className={inputClass}>
                      {DEPARTMENTS.filter(d=>d!=="Administration" && d!=="Ministerial Staff").map(d=><option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                )}
                <p className="text-[10px] font-black text-black mt-2">Ex: Prof. Ali = Vice Principal + HOD</p>
              </div>
              <button onClick={handleAdd} className="w-full bg-black text-white border-2 border-black font-black text-sm py-4 rounded-xl hover:bg-white hover:text-black transition">+ Add Faculty</button>
            </div>
          </div>
          <div className="lg:col-span-6 bg-white rounded-2xl border-2 border-black p-4 flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
            <h2 className="font-black text-[14px] text-black mb-3">{activeDept} Faculty ({filteredData.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-auto flex-1 pr-1 content-start">
              {loading ? <p className="col-span-full text-center py-12 text-sm text-black font-black">Loading...</p> :
               filteredData.map((f:any, index:number)=>(
                <div key={String(f.id)} className="p-3.5 rounded-xl border-2 border-black bg-white relative">
                  <button onClick={()=>del(f.id)} className="absolute top-1.5 right-1.5 w-6 h-6 border-2 border-black rounded-md text-[11px] font-black bg-white text-black">✕</button>
                  <div className="flex gap-2 items-start">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black bg-white text-black border-2 border-black">{index + 1}</div>
                    <p className="text-[13px] font-black text-black pr-6">{f.name}</p>
                  </div>
                  <p className="text-[11px] font-black ml-8 text-black mt-1 leading-snug border border-black px-2 py-1 rounded-full inline-block">{f.designation}</p>
                  <p className="text-[10px] font-black ml-8 text-black uppercase mt-1">{f.department}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex lg:col-span-3 bg-white rounded-2xl border-2 border-black p-4 flex-col overflow-hidden">
            <h3 className="font-black text-[12px] uppercase text-black mb-3">Departments</h3>
            <div className="flex flex-col gap-2 overflow-auto flex-1">
              {["All", ...DEPARTMENTS].map(d=>(
                <button key={d} onClick={()=>setActiveDept(d)} className={`w-full text-left px-4 py-3 rounded-xl text-[13px] font-black border-2 border-black ${activeDept===d ? "bg-black text-white" : "bg-white text-black"}`}>{d} ({getCount(d)})</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}