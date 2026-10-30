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

  if (loading) return <div className="p-10 font-black text-black animate-pulse">Loading Contact Info...</div>;

  return (
    <div className="p-3 md:p-10 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={()=>router.push("/admin")} 
            className="w-10 h-10 bg-black text-white border-2 border-black rounded-full flex items-center justify-center font-black hover:bg-white hover:text-black transition-all shrink-0"
          >
            ←
          </button>
          <h1 className="text-xl md:text-3xl font-black text-black">Manage Contact Info</h1>
        </div>

        <div className="bg-white rounded-2xl border-2 border-black p-6 md:p-8 mt-6 space-y-6">
          <div>
            <label className="block font-black text-sm text-black mb-2 uppercase">Address *</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Address" required className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm font-black text-black placeholder:text-black placeholder:opacity-60 bg-white outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block font-black text-sm text-black mb-2 uppercase">Phone *</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Phone Number" required className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm font-black text-black placeholder:text-black placeholder:opacity-60 bg-white outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block font-black text-sm text-black mb-2 uppercase">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" required className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm font-black text-black placeholder:text-black placeholder:opacity-60 bg-white outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block font-black text-sm text-black mb-2 uppercase">Map Embed URL</label>
            <textarea name="mapUrl" value={formData.mapUrl} onChange={handleChange} rows={3} placeholder="Paste Google Map Embed URL" className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm font-black text-black placeholder:text-black placeholder:opacity-60 bg-white outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div className="pt-2">
            <button onClick={handleSave} disabled={saving} className="w-full bg-black text-white border-2 border-black font-black py-3.5 rounded-xl hover:bg-white hover:text-black transition disabled:opacity-50">
              {saving ? "Saving..." : "Save & Publish to Website"}
            </button>
            {saved && <p className="text-black text-sm font-black text-center mt-3 bg-white border-2 border-black py-2 rounded-xl">{offlineMsg ? "Offline Saved! Will publish when online." : "Saved Successfully!"}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}