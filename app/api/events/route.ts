import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const data = await prisma.event.findMany({
      orderBy: { eventDate: 'desc' },
    });
    return NextResponse.json(data);
  } catch (e) {
    console.error("Event GET Error:", e);
    return NextResponse.json({ error: "DB offline", offline: true }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }
    const created = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description || "",
        image: body.image || "",
        location: body.location || "",
        eventDate: body.eventDate ? new Date(body.eventDate) : new Date(),
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error("Event POST Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// FIX 1: PATCH add kiya - offline sync isi ko bhejta hai
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.eventDate && { eventDate: new Date(data.eventDate) }),
      }
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    console.error("Event PATCH Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    // FIX 2: ID ko body + searchParams dono se lo
    let id: string | null = null;
    try {
      const body = await req.json();
      id = body.id || body._id || null;
    } catch {}
    
    if (!id) {
      const { searchParams } = new URL(req.url);
      id = searchParams.get("id");
    }

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Event DELETE Error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}