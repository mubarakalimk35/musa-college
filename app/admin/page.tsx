'use client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN_USERNAME = "musacollege@gmail.com"; 
  const ADMIN_PASSWORD = "admin0909";

  useEffect(() => {
    if (localStorage.getItem("musa_admin_login") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchData = () => {
    fetch('/api/admissions')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => a.id - b.id);
        setAdmissions(sorted);
      });
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("musa_admin_login", "true");
      setIsLoggedIn(true);
      setError("");
    } else {
      setError("Invalid username or password!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("musa_admin_login");
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const deleteAdmission = async (id: number) => {
    if(!confirm("Are you sure you want to delete?")) return;
    await fetch(`/api/admissions/${id}`, { method: 'DELETE' });
    setAdmissions(prev => prev.filter(a => a.id !== id));
  };

  const downloadExcel = async () => {
    const XLSX = await import('xlsx-js-style');
    const workbook = XLSX.utils.book_new();
    const cols = [
      { wch: 6 }, { wch: 18 }, { wch: 18 }, { wch: 11 }, { wch: 16 }, { wch: 10 },
      { wch: 11 }, { wch: 11 }, { wch: 14 }, { wch: 25 }, { wch: 18 }, { wch: 10 },
    ];
    const formatData = (list: any[]) => list.map((ad, index) => ({
      "S.No": index + 1,
      "Student Name": ad.studentName,
      "Father Name": ad.fatherName,
      "DOB": ad.dob,
      "CNIC": ad.cnic,
      "Religion": ad.religion,
      "Nationality": ad.nationality,
      "Domicile": ad.domicile,
      "Mobile No": ad.mobile,
      "Address": ad.address,
      "Admission Date": ad.createdAt,
      "Status": ad.status || "Pending",
    }));
    const uniquePrograms = [...new Set(admissions.map((a: any) => a.program || "Other"))];
    uniquePrograms.forEach((progName: string) => {
      const filtered = admissions.filter((a: any) => (a.program || "Other") === progName);
      const data = formatData(filtered);
      let ws = XLSX.utils.aoa_to_sheet([[`${progName} List`], []]);
      XLSX.utils.sheet_add_json(ws, data, { origin: "A3" });
      ws["A1"].s = { font: { bold: true, sz: 18, name: "Arial" }, alignment: { horizontal: "center", vertical: "center" } };
      for(let C = 0; C < 12; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: 2, c: C });
        if(ws[cellRef]) {
          ws[cellRef].s = { font: { bold: true, sz: 11 }, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "D9D9D9" } } };
        }
      }
      ws["!rows"] = [{ hpt: 35 }, { hpt: 8 }, { hpt: 22 }];
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }];
      ws["!cols"] = cols;
      ws["!autofilter"] = { ref: `A3:L${data.length + 3}` };
      (ws as any)["!pageSetup"] = { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
      (ws as any)["!margins"] = { left: 0.25, right: 0.25, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 };
      const safeName = progName.substring(0, 31).replace(/[:\\/?*\[\]]/g, "");
      XLSX.utils.book_append_sheet(workbook, ws, safeName || "Other");
    });
    XLSX.writeFile(workbook, `MUSA_Admissions.xlsx`, { cellStyles: true });
  };

  useEffect(() => { if(isLoggedIn) fetchData(); }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl font-bold">M</div>
            <h1 className="text-2xl font-bold">MUSA College</h1>
            <p className="text-gray-500 text-sm">Admin Panel Login</p>
          </div>

          <label className="text-sm font-semibold text-gray-700">Username / Email</label>
          <input
            type="text"
            placeholder="admin@gmail.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400"
            required
          />

          <label className="text-sm font-semibold text-gray-700">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-green-600 placeholder:text-gray-400"
            required
          />

          {error && <p className="text-red-600 bg-red-50 p-2 rounded text-sm mb-3 text-center">{error}</p>}
          
          <button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-bold mt-2 shadow">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">MUSA College - Admin Panel</h1>
        <div className="flex gap-2">
          <button onClick={downloadExcel} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2.5 rounded font-bold shadow">⬇️ Download Excel</button>
          <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2.5 rounded font-bold">Logout</button>
        </div>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-[12px] text-left min-w-[1400px]">
          <thead className="bg-gray-800 text-white"><tr><th className="p-2">S.No</th><th className="p-2">Student Name</th><th className="p-2">Father Name</th><th className="p-2">Program</th><th className="p-2">DOB</th><th className="p-2">CNIC</th><th className="p-2">Religion</th><th className="p-2">Nationality</th><th className="p-2">Domicile</th><th className="p-2">Mobile</th><th className="p-2">Status</th><th className="p-2">Action</th></tr></thead>
          <tbody>{admissions.map((ad, i) => (<tr key={ad.id} className="border-b"><td className="p-2">{i+1}</td><td className="p-2 font-bold">{ad.studentName}</td><td className="p-2">{ad.fatherName}</td><td className="p-2">{ad.program}</td><td className="p-2">{ad.dob}</td><td className="p-2">{ad.cnic}</td><td className="p-2">{ad.religion}</td><td className="p-2">{ad.nationality}</td><td className="p-2">{ad.domicile}</td><td className="p-2">{ad.mobile}</td><td className="p-2">{ad.status || 'Pending'}</td><td className="p-2 flex gap-1"><button onClick={() => updateStatus(ad.id, 'Approved')} className="bg-green-600 text-white px-2 py-1 rounded">Approve</button><button onClick={() => updateStatus(ad.id, 'Rejected')} className="bg-red-600 text-white px-2 py-1 rounded">Reject</button><button onClick={() => deleteAdmission(ad.id)} className="bg-gray-600 text-white px-2 py-1 rounded">Delete</button></td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}