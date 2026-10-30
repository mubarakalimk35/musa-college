"use client";
import { useState, useRef } from "react";
import Link from "next/link";

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cnicError, setCnicError] = useState("");
  const dateRef = useRef<HTMLInputElement>(null);

  const initialForm = {
    program: "", studentName: "", fatherName: "", dob: "", // dob ISO me rakhenge
    cnic: "", religion: "", nationality: "Pakistani", domicile: "", mobile: "", address: ""
  };
  const [formData, setFormData] = useState(initialForm);
  const [displayDob, setDisplayDob] = useState(""); // user ko DD/MM/YYYY dikhega

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // Mobile only digits + dash allow
    if(name==="mobile"){
      const v = value.replace(/[^0-9-]/g,"").slice(0,12);
      setFormData({ ...formData, [name]: v });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleDobChange = (e: any) => {
    const iso = e.target.value; // YYYY-MM-DD
    if (iso) {
      const [y, m, d] = iso.split("-");
      setFormData({ ...formData, dob: iso }); // DB me ISO save
      setDisplayDob(`${d}/${m}/${y}`); // Display me DD/MM/YYYY
    }
  };

  const handleCnicChange = (e: any) => {
    const val = e.target.value.replace(/\D/g, "").slice(0,13);
    setFormData({ ...formData, cnic: val });
    setCnicError(val.length === 13 || val.length === 0 ? "" : "CNIC must be 13 digits");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.cnic.length !== 13) { setCnicError("CNIC must be 13 digits"); return; }
    if (!formData.dob) { alert("Please select Date of Birth"); return; }
    if (formData.mobile.length < 11) { alert("Enter valid Mobile No"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admissions", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(formData),
        cache: "no-store"
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSubmitted(true);
        setFormData(initialForm);
        setDisplayDob("");
      } else {
        alert("Failed: " + (result.error || "Try again"));
      }
    } catch (err:any) { 
      alert("Error: " + err.message); 
    } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="text-6xl">✅</div>
          <h3 className="text-2xl font-black text-green-700 mt-4">Application Submitted!</h3>
          <p className="mt-2 text-gray-600">Your data is saved. We will contact you soon.</p>
          <Link href="/" className="mt-6 inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-bold">Go to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <Link href="/" className="inline-block mb-6 text-sm font-bold bg-white px-4 py-2 rounded-full shadow">← Back to Home</Link>
        <div className="bg-white w-full rounded-2xl shadow-xl overflow-hidden">
          <div className="flex justify-between items-center p-4 px-6 border-b bg-gray-50">
            <h2 className="text-[16px] md:text-lg font-black text-[#0d2a54]">ADMISSION FORM</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[13px] font-black text-gray-900">Program *</label>
                <select name="program" value={formData.program} onChange={handleChange} required className="w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl bg-white text-[15px] font-semibold outline-none focus:border-blue-600">
                  <option value="">Select Program</option>
                  <option>FSc Pre-Medical</option><option>FSc Pre-Engineering</option><option>FA</option><option>ICS</option>
                  <option>BS Computer Science</option><option>BS English</option><option>BS Physics</option><option>BS Mathematics</option><option>BS Zoology</option><option>BS Economics</option><option>BS Microbiology</option>
                </select>
              </div>
              <div><label className="text-[13px] font-black text-gray-900">Student Name *</label><input name="studentName" value={formData.studentName} onChange={handleChange} required className="w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none focus:border-blue-600" placeholder="Full Name" /></div>
              <div><label className="text-[13px] font-black text-gray-900">Father's Name *</label><input name="fatherName" value={formData.fatherName} onChange={handleChange} required className="w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none focus:border-blue-600" placeholder="Father's Name" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[13px] font-black text-gray-900">Date of Birth *</label>
                <div className="relative w-full mt-2">
                  <input value={displayDob} placeholder="DD/MM/YYYY" readOnly required onClick={() => (dateRef.current as any)?.showPicker?.()} className="w-full border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none bg-white cursor-pointer" />
                  <span onClick={() => (dateRef.current as any)?.showPicker?.()} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-lg">📅</span>
                  <input ref={dateRef} type="date" onChange={handleDobChange} className="absolute opacity-0 pointer-events-none w-0 h-0" />
                </div>
              </div>
              <div><label className="text-[13px] font-black text-gray-900">CNIC *</label><input name="cnic" required value={formData.cnic} onChange={handleCnicChange} className={`w-full mt-2 border-2 p-3.5 rounded-xl text-[15px] font-bold outline-none ${cnicError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-600'}`} placeholder="5440012345678" maxLength={13} />{cnicError && <p className="text-[12px] text-red-600 mt-1 font-bold">{cnicError}</p>}</div>
              <div><label className="text-[13px] font-black text-gray-900">Religion *</label><select name="religion" value={formData.religion} onChange={handleChange} required className="w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl bg-white text-[15px] font-medium outline-none focus:border-blue-600"><option value="">Select</option><option>Islam</option><option>Christianity</option><option>Hinduism</option><option>Other</option></select></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><label className="text-[13px] font-black text-gray-900">Nationality *</label><input name="nationality" value={formData.nationality} onChange={handleChange} required className="w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none focus:border-blue-600" /></div>
              <div><label className="text-[13px] font-black text-gray-900">Local/Domicile *</label><input name="domicile" value={formData.domicile} onChange={handleChange} required className="w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none focus:border-blue-600" placeholder="Quetta" /></div>
              <div><label className="text-[13px] font-black text-gray-900">Mobile No *</label><input name="mobile" value={formData.mobile} onChange={handleChange} required type="tel" className="w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none focus:border-blue-600" placeholder="03XX-XXXXXXX" /></div>
            </div>

            <div><label className="text-[13px] font-black text-gray-900">Complete Address *</label><textarea name="address" value={formData.address} onChange={handleChange} required className="w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none focus:border-blue-600" rows={2} placeholder="House No, Street, Town, City"></textarea></div>
            
            <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-4 rounded-xl font-black text-[16px] shadow-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Submitting..." : "Submit Application"}</button>
          </form>
        </div>
      </div>
    </main>
  );
}