"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { offlinePost } from "@/lib/offlineSync";

export default function AdminContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    address: "Gulistan Town, Quetta, Balochistan",
    phone: "081-2669085",
    email: "mubarakali.mk.35@gmail.com",
    mapUrl: "https://www.google.com/maps?q=Govt+General+Muhammad+Musa+Postgraduate+College+Quetta&z=15&output=embed"
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [offlineMsg, setOfflineMsg] = useState(false);

  useEffect(() => {
    fetch("/api/contact", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.address) setFormData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if(!formData.address.trim() || !formData.phone.trim() || !formData.email.trim()){
      alert("Address, Phone, Email required!");
      return;
    }
    setSaving(true);
    try {
      const res: any = await offlinePost("/api/contact", formData);
      if (res?.ok || res?.offline) {
        setSaved(true);
        setOfflineMsg(!!res.offline);
        setTimeout(() => {
          setSaved(false);
          setOfflineMsg(false);
        }, 3000);
      } else {
        alert("Save failed!");
      }
    } catch (e:any){
      alert("Error: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 font-bold text-[#0d2a54] animate-pulse">Loading Contact Info...</div>;

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={()=>router.push("/admin")} 
            className="bg-white border w-10 h-10 rounded-lg flex items-center justify-center font-bold hover:bg-gray-50"
          >
            ←
          </button>
          <h1 className="text-3xl font-black text-[#0d2a54]">Manage Contact Info</h1>
        </div>
        <p className="text-gray-500 text-sm ml-14 -mt-4 mb-2">Changes will update automatically on the main website.</p>

        <div className="bg-white rounded-xl shadow p-8 mt-6 space-y-6">
          <div>
            <label className="block font-bold text-sm text-[#0d2a54] mb-2">Address *</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Address" required className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0d2a54] focus:ring-1 focus:ring-[#0d2a54]" />
          </div>
          <div>
            <label className="block font-bold text-sm text-[#0d2a54] mb-2">Phone *</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Phone Number" required className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0d2a54] focus:ring-1 focus:ring-[#0d2a54]" />
          </div>
          <div>
            <label className="block font-bold text-sm text-[#0d2a54] mb-2">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" required className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0d2a54] focus:ring-1 focus:ring-[#0d2a54]" />
          </div>
          <div>
            <label className="block font-bold text-sm text-[#0d2a54] mb-2">Map Embed URL</label>
            <textarea name="mapUrl" value={formData.mapUrl} onChange={handleChange} rows={3} placeholder="Paste Google Map Embed URL" className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#0d2a54] focus:ring-1 focus:ring-[#0d2a54]" />
          </div>
          <div className="pt-4">
            <button onClick={handleSave} disabled={saving} className="w-full bg-[#0d2a54] text-white font-bold py-3 rounded-lg hover:bg-[#123a75] transition disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? "Saving..." : "Save & Publish to Website"}
            </button>
            {saved && <p className="text-green-600 text-sm font-bold text-center mt-3 animate-pulse">{offlineMsg ? "📶 Offline Saved! Will publish when online." : "✅ Saved Successfully!"}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}