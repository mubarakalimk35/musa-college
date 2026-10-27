"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx-js-style";

export default function AdminPanel() {
  const router = useRouter();
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/admissions");
    const data = await res.json();
    if(Array.isArray(data)) {
      const sorted = data.sort((a: any, b: any) => a.id - b.id);
      setAdmissions(sorted);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: number, status: string) => {
    if(!confirm(`Make this ${status}?`)) return;
    await fetch("/api/admissions", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ id, status }) });
    fetchData();
  };

  const deleteAdmission = async (id: number) => {
    if(!confirm("Delete this application permanently?")) return;
    await fetch(`/api/admissions?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const grouped: any = {};
    admissions.forEach(a => {
      const prog = (a.program || "Others").trim();
      if(!grouped[prog]) grouped[prog] = [];
      grouped[prog].push(a);
    });

    const headers = ["S.No","StudentName","FatherName","DOB","CNIC","Religion","Nationality","Domicile","Mobile","Address","CreatedAt","Status"];

    Object.keys(grouped).forEach(programName => {
      const list = grouped[programName];
      const sheetData: any[] = [];
      sheetData.push([programName.toUpperCase()]);
      sheetData.push([]);
      sheetData.push(headers);

      list.forEach((a: any, idx: number) => {
        sheetData.push([
          idx + 1, a.studentName, a.fatherName, a.dob, a.cnic,
          a.religion, a.nationality, a.domicile, a.mobile,
          a.address, a.createdAt, a.status
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      ws['!cols'] = headers.map((h, i) => {
        if(i === 0) return { wch: 6 };
        let maxLen = h.length;
        sheetData.slice(2).forEach((row:any) => {
          const val = String(row[i] ?? "");
          if(val.length > maxLen) maxLen = val.length;
        });
        return { wch: Math.min(Math.max(maxLen + 2, 10), 35) };
      });
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
      // @ts-ignore
      ws['A1'].s = { font: { bold: true, sz: 18, name: "Calibri" }, alignment: { horizontal: 'center', vertical: 'center' } };
      headers.forEach((_, colIdx) => {
        const cellRef = XLSX.utils.encode_cell({ r: 2, c: colIdx });
        if(ws[cellRef]) {
          ws[cellRef].s = {
            font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
            fill: { patternType: "solid", fgColor: { rgb: "1E293B" } },
            alignment: { horizontal: 'center', vertical: 'center' }
          };
        }
      });
      const sheetName = programName.substring(0, 30).replace(/[:\\/?*\[\]]/g, '');
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
    XLSX.writeFile(wb, "MUSA-Admissions-Program-Wise.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <button onClick={()=>router.push("/admin")} className="bg-white border px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50">← Back</button>
          <h1 className="text-xl font-bold">MUSA College - Admissions</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadExcel} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold">⬇ Download Excel</button>
        </div>
      </div>
      <div className="bg-white border rounded-lg overflow-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="p-2 text-left">S.No</th><th className="p-2 text-left">Student Name</th><th className="p-2 text-left">Father Name</th><th className="p-2 text-left">Program</th><th className="p-2 text-left">DOB</th><th className="p-2 text-left">CNIC</th><th className="p-2 text-left">Religion</th><th className="p-2 text-left">Nationality</th><th className="p-2 text-left">Domicile</th><th className="p-2 text-left">Mobile</th><th className="p-2 text-left">Address</th><th className="p-2 text-left">CreatedAt</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={14} className="p-10 text-center">Loading...</td></tr> :
             admissions.length === 0 ? <tr><td colSpan={14} className="p-10 text-center">No admissions found</td></tr> :
             admissions.map((r,i)=>(
              <tr key={r.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{i+1}</td><td className="p-2 font-bold">{r.studentName}</td><td className="p-2">{r.fatherName}</td><td className="p-2">{r.program}</td><td className="p-2">{r.dob}</td><td className="p-2">{r.cnic}</td><td className="p-2">{r.religion}</td><td className="p-2">{r.nationality}</td><td className="p-2">{r.domicile}</td><td className="p-2">{r.mobile}</td><td className="p-2 max-w-[150px] truncate" title={r.address}>{r.address}</td><td className="p-2 text-[11px]">{r.createdAt}</td>
                <td className="p-2"><span className={`px-2 py-1 rounded text-[10px] font-bold ${r.status==='APPROVED'?'bg-green-100 text-green-700': r.status==='REJECTED'?'bg-red-100 text-red-700':'bg-yellow-100 text-yellow-700'}`}>{r.status}</span></td>
                <td className="p-2"><div className="flex gap-1"><button onClick={()=>updateStatus(r.id, 'APPROVED')} className="bg-green-600 text-white px-2 py-1 rounded text-[10px]">Approved</button><button onClick={()=>updateStatus(r.id, 'REJECTED')} className="bg-orange-500 text-white px-2 py-1 rounded text-[10px]">Reject</button><button onClick={()=>deleteAdmission(r.id)} className="bg-red-600 text-white px-2 py-1 rounded text-[10px]">Delete</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}