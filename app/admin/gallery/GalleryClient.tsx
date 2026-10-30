"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GalleryAdmin() {
  const router = useRouter()
  const [images, setImages] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("General")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery", { cache: 'no-store' })
      if (!res.ok) throw new Error("DB error")
      const data = await res.json()
      const arr = Array.isArray(data) ? data : []
      setImages(arr)
      localStorage.setItem("gallery_cache", JSON.stringify(arr))
      setStatus("")
    } catch {
      const cached = localStorage.getItem("gallery_cache")
      if (cached) {
        try { setImages(JSON.parse(cached)); setStatus("⚠️ Showing cached data (Offline)") }
        catch { setImages([]) }
      }
    }
  }

  useEffect(() => {
    fetchGallery()
    const onOnline = () => syncPending()
    window.addEventListener("online", onOnline)
    return () => {
      window.removeEventListener("online", onOnline)
      if(preview) URL.revokeObjectURL(preview)
    }
  }, [])

  const handleFileChange = (f: File | null) => {
    if (preview) URL.revokeObjectURL(preview)
    if (f) {
      if (f.size > 5 * 1024 * 1024) return alert("Max 5MB allowed")
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      if (!validTypes.includes(f.type)) return alert("Only JPEG, JPG, PNG, WEBP allowed")
      setFile(f)
      setPreview(URL.createObjectURL(f))
    } else {
      setFile(null)
      setPreview("")
    }
  }

  const syncPending = async () => {
    const pending = JSON.parse(localStorage.getItem("gallery_pending") || "[]")
    if (pending.length === 0 || !navigator.onLine) return
    setStatus("Syncing offline data...")
    for (const item of pending) {
      try {
        await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        })
      } catch {}
    }
    localStorage.removeItem("gallery_pending")
    await fetchGallery()
  }

  const handleUpload = async (e: any) => {
    e.preventDefault()
    if (!file) return alert("Please select an image")
    if (!title.trim()) return alert("Title required")
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/upload?folder=gallery", { method: "POST", body: formData })
      const result = await uploadRes.json()
      if (!uploadRes.ok || !result.url) throw new Error(result.error || "Upload failed")

      const saveRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), category, imageUrl: result.url })
      })
      if(!saveRes.ok) throw new Error("DB save failed")

      setTitle(""); setFile(null); 
      if(preview) URL.revokeObjectURL(preview)
      setPreview("")
      await fetchGallery()

    } catch (err:any) {
      if(!navigator.onLine){
        alert("You are offline! Image will upload when online.")
        const pending = JSON.parse(localStorage.getItem("gallery_pending") || "[]")
        localStorage.setItem("gallery_pending", JSON.stringify(pending))
        setStatus("📶 Offline - Upload when online")
      } else {
        alert(err.message || "Upload failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this image?")) return
    const prev = images
    setImages(prev => prev.filter(i => String(i.id) !== String(id)))
    try{
      const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE", cache: 'no-store' })
      if(!res.ok) throw new Error()
      await fetchGallery()
    }catch{
      setImages(prev)
      alert("Delete failed")
    }
  }

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto bg-white min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white border-2 border-black shadow-sm hover:bg-white hover:text-black transition shrink-0 font-black">←</button>
        <h1 className="text-[20px] md:text-2xl font-black text-black">Gallery Control Panel</h1>
      </div>

      {status && <p className="text-xs font-black bg-yellow-100 border-2 border-black text-black px-3 py-2 rounded-lg mb-4">{status}</p>}

      <form onSubmit={handleUpload} className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border-2 border-black mb-8 grid gap-4 w-full md:max-w-lg">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Image Title *" className="border-2 border-black p-3 rounded-xl text-sm font-black text-black bg-white focus:outline-none placeholder:text-black placeholder:opacity-70" required />
        
        <select value={category} onChange={e=>setCategory(e.target.value)} className="border-2 border-black p-3 rounded-xl text-sm font-black bg-white text-black focus:outline-none">
          <option value="General">General</option>
          <option value="Sports Week">Sports Week</option>
          <option value="Convocation">Convocation</option>
        </select>

        <label className="border-2 border-dashed border-black rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50 transition group bg-white">
          <input type="file" accept=".jpeg,.jpg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={e=>handleFileChange(e.target.files?.[0] || null)} required />
          {preview ? (
            <img src={preview} alt="preview" className="h-36 mx-auto rounded-xl object-cover border-2 border-black" />
          ) : (
            <div>
              <div className="text-3xl mb-2 group-hover:scale-110 transition">📸</div>
              <p className="text-sm font-black text-black">Click to choose file</p>
              <p className="text-xs text-black font-black mt-1">JPEG, JPG, PNG, WEBP up to 5MB</p>
            </div>
          )}
        </label>

        <button disabled={loading} className="bg-black text-white p-3.5 rounded-xl font-black text-sm border-2 border-black disabled:bg-gray-400 active:scale-[0.98] transition hover:bg-white hover:text-black">
          {loading ? "Uploading..." : "Upload to Gallery"}
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {images.length===0 ? <p className="col-span-full text-center py-16 text-black font-black">No images yet</p> :
        images.map((img: any) => (
          <div key={String(img.id)} className="border-2 border-black rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition group">
            <img src={img.imageUrl} alt={img.title} className="h-36 md:h-44 w-full object-cover bg-white border-b-2 border-black" loading="lazy" />
            <div className="p-3">
              <p className="font-black text-[13px] truncate text-black">{img.title}</p>
              <p className="text-[11px] text-black font-black">{img.category}</p>
              <button onClick={()=>handleDelete(String(img.id))} className="w-full mt-2 bg-white text-black border-2 border-black text-[11px] font-black py-1.5 rounded-lg hover:bg-black hover:text-white transition">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}