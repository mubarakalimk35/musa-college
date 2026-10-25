"use client";
import { useState, useRef, useEffect } from "react";

export default function AdmissionForm({ showForm, setShowForm }: any) {
  const [submitted, setSubmitted] = useState(false);
  const [cnic, setCnic] = useState("");
  const [cnicError, setCnicError] = useState("");
  const dateRef = useRef<HTMLInputElement>(null);

  const initialForm = {
    program: "", studentName: "", fatherName: "", dob: "", cnic: "",
    religion: "", nationality: "Pakistani", domicile: "", mobile: "", address: ""
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (showForm) {
      setSubmitted(false);
      setFormData(initialForm);
      setCnic("");
      setCnicError("");
    }
  }, [showForm]);

  if (!showForm) return null;

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDobChange = (e: any) => {
    const iso = e.target.value;
    if (iso) {
      const [y, m, d] = iso.split("-");
      setFormData({ ...formData, dob: `${d}/${m}/${y}` });
    }
  };

  const handleCnicChange = (e: any) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 13) {
      setCnic(val);
      setFormData({ ...formData, cnic: val });
      setCnicError(val.length === 13 || val.length === 0 ? "" : "CNIC must be 13 digits");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.cnic.length !== 13) {
      setCnicError("CNIC must be 13 digits");
      return;
    }
    if (!formData.dob) {
      alert("Please select Date of Birth");
      return;
    }
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        alert("Failed to save!");
      }
    } catch (err) {
      alert("Error: " + err);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setFormData(initialForm);
    setCnic("");
    setCnicError("");
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start md:items-center justify-center z-[99999] p-0 md:p-4 overflow-y-auto">
      <div className="bg-white w-full md:rounded-2xl max-w-3xl my-0 md:my-4 flex flex-col max-h-screen shadow-2xl">
        <div className="flex justify-between items-center p-4 px-6 border-b bg-white md:bg-gray-50 md:rounded-t-2xl shrink-0 sticky top-0 z-20">
          <h2 className="text-[15px] md:text-lg font-black text-[#0d2a54]">ADMISSION FORM</h2>
          <div onClick={handleClose} className="w-9 h-9 bg-gray-100 border rounded-full flex items-center justify-center font-bold cursor-pointer text-black">×</div>
        </div>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto bg-white flex-1">
            <div>
              <label className="text-[13px] font-black text-gray-900">Program *</label>
              <select name="program" value={formData.program} onChange={handleChange} required className="form-input w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl bg-white text-[15px] font-semibold outline-none">
                <option value="">Select Program</option>
                <option>FSc Pre-Medical</option><option>FSc Pre-Engineering</option><option>FA</option><option>ICS</option>
                <option>BS Computer Science</option><option>BS English</option><option>BS Physics</option><option>BS Mathematics</option><option>BS Zoology</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-[13px] font-black text-gray-900">Student Name *</label><input name="studentName" value={formData.studentName} onChange={handleChange} required className="form-input w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none" placeholder="Full Name" /></div>
              <div><label className="text-[13px] font-black text-gray-900">Father's Name *</label><input name="fatherName" value={formData.fatherName} onChange={handleChange} required className="form-input w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none" placeholder="Father's Name" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-black text-gray-900">Date of Birth *</label>
                <div className="relative w-full mt-2">
                  <input value={formData.dob} placeholder="DD/MM/YYYY" readOnly required onClick={() => dateRef.current?.showPicker()} className="form-input w-full border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none bg-white cursor-pointer" />
                  <span onClick={() => dateRef.current?.showPicker()} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-lg">📅</span>
                  <input ref={dateRef} type="date" onChange={handleDobChange} className="absolute opacity-0 pointer-events-none w-0 h-0" />
                </div>
              </div>
              <div><label className="text-[13px] font-black text-gray-900">CNIC (without dashes) *</label><input name="cnic" required value={cnic} onChange={handleCnicChange} className={`form-input w-full mt-2 border-2 p-3.5 rounded-xl text-[15px] font-bold outline-none ${cnicError ? 'border-red-500' : 'border-gray-300'}`} placeholder="5440012345678" maxLength={13} />{cnicError && <p className="text-[12px] text-red-600 mt-1 font-bold">{cnicError}</p>}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-[13px] font-black text-gray-900">Religion *</label><select name="religion" value={formData.religion} onChange={handleChange} required className="form-input w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl bg-white text-[15px] font-medium outline-none"><option value="">Select</option><option>Islam</option><option>Christianity</option><option>Hinduism</option><option>Other</option></select></div>
              <div><label className="text-[13px] font-black text-gray-900">Nationality *</label><input name="nationality" value={formData.nationality} onChange={handleChange} required className="form-input w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-[13px] font-black text-gray-900">Local/Domicile *</label><input name="domicile" value={formData.domicile} onChange={handleChange} required className="form-input w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none" placeholder="Quetta" /></div>
              <div><label className="text-[13px] font-black text-gray-900">Mobile No *</label><input name="mobile" value={formData.mobile} onChange={handleChange} required type="tel" className="form-input w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none" placeholder="03XX-XXXXXXX" /></div>
            </div>
            <div><label className="text-[13px] font-black text-gray-900">Complete Address *</label><textarea name="address" value={formData.address} onChange={handleChange} required className="form-input w-full mt-2 border-2 border-gray-300 p-3.5 rounded-xl text-[15px] font-medium outline-none" rows={1} placeholder="House No, Street, Town, City"></textarea></div>
            <button type="submit" className="w-full bg-blue-700 text-white py-4 rounded-xl font-black text-[16px] shadow-lg">Submit Application</button>
          </form>
        ) : (
          <div className="p-10 text-center bg-white">
            <div className="text-6xl">✅</div>
            <h3 className="text-xl font-black text-green-700 mt-4">Application Submitted!</h3>
            <p className="mt-2">Your data is saved in database.</p>
            <button onClick={handleClose} className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-lg">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}