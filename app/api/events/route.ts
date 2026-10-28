import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const fallbackEvents = [
  {
    id: "1",
    title: "Annual Sports Day 2025",
    description: "Annual sports day will be held at college ground.",
    image: "",
    location: "College Ground, Quetta",
    eventDate: new Date(),
    createdAt: new Date()
  }
];

export async function GET() {
  try {
    const data = await prisma.event.findMany({
      orderBy: { eventDate: 'desc' },
    });
    return NextResponse.json(data);
  } catch (e) {
    console.error("Event GET Error:", e);
    return NextResponse.json(fallbackEvents);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        image: body.image || "",
        location: body.location || "",
        eventDate: body.eventDate ? new Date(body.eventDate) : new Date(),
      }
    });
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}