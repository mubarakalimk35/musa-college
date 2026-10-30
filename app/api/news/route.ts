import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const noStore = { "Cache-Control": "no-store" } as const;

export async function GET() {
  try {
    const [news, events] = await Promise.all([
      prisma.news.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.event.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);
    
    const combined = [
      ...news.map((n: any) => ({ 
        id: n.id,
        title: n.title, 
        description: n.content, 
        content: n.content,
        date: n.date, 
        category: "News",
        isTicker: n.isTicker || false,
        createdAt: n.createdAt 
      })),
      ...events.map((e: any) => ({ 
        id: e.id,
        title: e.title, 
        description: e.description, 
        content: e.description,
        date: e.eventDate, 
        time: e.time || "",
        location: e.location || "",
        category: "Events",
        isTicker: e.isTicker || false,
        createdAt: e.createdAt 
      }))
    ].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(combined, { headers: noStore });
  } catch (e) {
    console.error("NEWS GET DB DOWN:", e);
    return NextResponse.json({ error: "DB offline", offline: true, data: [] }, { status: 503, headers: noStore });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body.id || body._id;

    // 1. Offline Delete (AdminLayout se aata hai)
    if (body._method === "DELETE" && id) {
      try {
        await prisma.news.delete({ where: { id } });
      } catch {
        await prisma.event.delete({ where: { id } });
      }
      return NextResponse.json({ success: true }, { headers: noStore });
    }

    // 2. Offline PATCH - Ticker Toggle
    if (body._method === "PATCH" && id) {
      const data = { isTicker: !!body.isTicker };
      if (body.category === "Events") {
        const updated = await prisma.event.update({ where: { id }, data });
        return NextResponse.json(updated, { headers: noStore });
      } else {
        const updated = await prisma.news.update({ where: { id }, data });
        return NextResponse.json(updated, { headers: noStore });
      }
    }

    // 3. Create New
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title required" }, { status: 400, headers: noStore });
    }

    if (body.category === "Events") {
      const created = await prisma.event.create({
        data: {
          title: body.title.trim(),
          description: body.description || body.content || "No description",
          eventDate: body.date ? new Date(body.date) : new Date(),
          location: body.location || "College Campus",
          time: body.time || "",
          isTicker: !!body.isTicker,
        }
      });
      return NextResponse.json(created, { status: 201, headers: noStore });
    } else {
      const created = await prisma.news.create({
        data: {
          title: body.title.trim(),
          content: body.description || body.content || "No description",
          date: body.date ? new Date(body.date) : new Date(),
          isTicker: !!body.isTicker,
        }
      });
      return NextResponse.json(created, { status: 201, headers: noStore });
    }
  } catch (e: any) {
    console.error("NEWS POST ERROR:", e);
    return NextResponse.json({ error: e.message }, { status: 500, headers: noStore });
  }
}

export async function DELETE(req: Request) {
  try {
    let id: string | null = null;
    try {
      const body = await req.json();
      id = body.id || body._id || null;
    } catch {}
    if (!id) {
      id = new URL(req.url).searchParams.get("id");
    }
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400, headers: noStore });

    try {
      await prisma.news.delete({ where: { id } });
    } catch {
      await prisma.event.delete({ where: { id } });
    }
    return NextResponse.json({ success: true }, { headers: noStore });
  } catch (e: any) {
    console.error("NEWS DELETE ERROR:", e);
    return NextResponse.json({ error: e.message }, { status: 500, headers: noStore });
  }
}