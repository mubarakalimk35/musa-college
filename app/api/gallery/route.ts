export const runtime = 'nodejs';

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

const noStore = { "Cache-Control": "no-store, no-cache, must-revalidate" }
// Prisma enum ke hisab se - space wala nahi chalega
const ALLOWED_CATEGORIES = ["General", "Sports_Week", "Convocation"] as const

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.min(100, Math.max(1, parseInt(searchParams.get("page") || "1")))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")))
    const category = searchParams.get("category")?.trim()
    const skip = (page - 1) * limit

    const where: any = {}
    if (category && ALLOWED_CATEGORIES.includes(category as any)) {
      where.category = category
    }
    // "Sports Week" ko bhi handle karna hai
    if (category === "Sports Week") {
      where.category = "Sports_Week"
    }

    const [gallery, total] = await Promise.all([
      prisma.gallery.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.gallery.count({ where })
    ])

    const mapped = gallery.map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      image: g.image,
      imageUrl: g.image, // frontend ke liye dono bhej rahe hain, DB me sirf image save hai
      createdAt: g.createdAt,
    }))

    return NextResponse.json({ data: mapped, total, page, totalPages: Math.ceil(total / limit) }, { headers: noStore })
  } catch (e: any) {
    console.error("Gallery GET Error:", e.message)
    return NextResponse.json({ error: "DB offline", offline: true, data: [], total: 0, page: 1, totalPages: 0 }, { status: 503, headers: noStore })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, category, imageUrl, image } = body
    const finalImage = (imageUrl || image)?.trim()

    if (!title?.trim() || title.trim().length < 2 || title.trim().length > 150) {
      return NextResponse.json({ error: "Title must be 2-150 chars" }, { status: 400, headers: noStore })
    }
    if (!finalImage || finalImage.length > 5000) {
      return NextResponse.json({ error: "Valid Image URL required" }, { status: 400, headers: noStore })
    }
    try { new URL(finalImage) } catch { 
      return NextResponse.json({ error: "Invalid image URL format" }, { status: 400, headers: noStore }) 
    }

    let safeCategory: any = "General"
    if (category === "Sports Week") safeCategory = "Sports_Week"
    else if (ALLOWED_CATEGORIES.includes(category as any)) safeCategory = category

    const newImage = await prisma.gallery.create({
      data: {
        title: title.trim(),
        category: safeCategory,
        image: finalImage, // <-- FIX: sirf 'image' bhejo, 'imageUrl' mat bhejo
      }
    })

    return NextResponse.json({ ...newImage, imageUrl: newImage.image }, { status: 201, headers: noStore })
  } catch (e: any) {
    console.error("Gallery POST Error:", e)
    return NextResponse.json({ error: "DB save failed" }, { status: 500, headers: noStore })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")?.trim()
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400, headers: noStore })

    await prisma.gallery.delete({ where: { id } })
    return NextResponse.json({ success: true }, { headers: noStore })
  } catch (e: any) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500, headers: noStore })
  }
}