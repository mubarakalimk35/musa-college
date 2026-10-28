import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });
    const events = await prisma.event.findMany({ orderBy: { createdAt: 'desc' } });
    
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

    return NextResponse.json(combined, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("DB DOWN:", e);
    return NextResponse.json({ error: "DB_DOWN" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Handle offline delete
    if (body._method === "DELETE" && body.id) {
      try {
        await prisma.news.delete({ where: { id: body.id } });
      } catch {
        await prisma.event.delete({ where: { id: body.id } });
      }
      return NextResponse.json({ success: true });
    }

    // 2. Handle ticker toggle from right side list
    if (body._method === "PATCH" && body.id) {
      if (body.category === "Events") {
        const updated = await prisma.event.update({
          where: { id: body.id },
          data: { isTicker: body.isTicker }
        });
        return NextResponse.json(updated);
      } else {
        const updated = await prisma.news.update({
          where: { id: body.id },
          data: { isTicker: body.isTicker }
        });
        return NextResponse.json(updated);
      }
    }

    if (body.category === "Events") {
      const created = await prisma.event.create({
        data: {
          title: body.title,
          description: body.description || body.content || "No description",
          eventDate: body.date ? new Date(body.date) : new Date(),
          location: body.location || "College Campus",
          time: body.time || "",
          isTicker: body.isTicker || false,
        }
      });
      return NextResponse.json(created);
    } else {
      const created = await prisma.news.create({
        data: {
          title: body.title,
          content: body.description || body.content || "No description",
          date: body.date ? new Date(body.date) : new Date(),
          isTicker: body.isTicker || false,
        }
      });
      return NextResponse.json(created);
    }
  } catch (e: any) {
    console.error("POST ERROR:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    try {
      await prisma.news.delete({ where: { id } });
    } catch {
      await prisma.event.delete({ where: { id } });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}