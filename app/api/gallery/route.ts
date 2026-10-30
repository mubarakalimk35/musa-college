import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

const noStore = { "Cache-Control": "no-store" }

// GET - saari images lana
export async function GET() {
  try {
    const gallery = await prisma.gallery.findMany({ 
      orderBy: { createdAt: 'desc' } 
    })
    return NextResponse.json(gallery, { headers: noStore })
  } catch (e:any) {
    console.error("Gallery GET Error:", e.message)
    return NextResponse.json([], { headers: noStore })
  }
}

// POST - nayi image add karna
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, category, imageUrl } = body

    if (!title?.trim() || !imageUrl?.trim()) {
      return NextResponse.json({ error: "Title & Image required" }, { status: 400, headers: noStore })
    }

    const newImage = await prisma.gallery.create({
      data: { 
        title: title.trim(), 
        category: category?.trim() || "General", 
        image: imageUrl.trim() // ✅ FIX: schema me 'image' hai, 'imageUrl' nahi
      }
    })
    return NextResponse.json(newImage, { headers: noStore })
  } catch (e:any) {
    console.error("Gallery POST Error:", e.message)
    return NextResponse.json({ error: e.message }, { status: 500, headers: noStore })
  }
}

// DELETE - image delete karna
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID missing" }, { status: 400, headers: noStore })
    }

    await prisma.gallery.delete({ where: { id: String(id) } })
    return NextResponse.json({ success: true }, { headers: noStore })
  } catch (e:any) {
    console.error("Gallery DELETE Error:", e.message)
    return NextResponse.json({ error: e.message }, { status: 500, headers: noStore })
  }
}