import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const noStore = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET() {
  try {
    const data = await prisma.faculty.findMany({ 
      orderBy: { order: 'asc' } 
    });
    return NextResponse.json(data, { headers: noStore });
  } catch (e: any) {
    console.error("Faculty GET Error (Neon offline?):", e.message);
    // ✅ Fallback mat bhejo, error bhejo taake frontend apna cache dikhaye
    return NextResponse.json(
      { error: "DB offline", offline: true, faculty: [] }, 
      { status: 503, headers: noStore }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Support offlinePost DELETE: { id, _method: "DELETE" }
    if (body._method === "DELETE" && body.id) {
      await prisma.faculty.delete({ where: { id: String(body.id) } });
      return NextResponse.json({ success: true }, { headers: noStore });
    }

    if (!body.name?.trim() || !body.designation?.trim()) {
      return NextResponse.json({ error: "Name & Designation required" }, { status: 400, headers: noStore });
    }

    const created = await prisma.faculty.create({
      data: {
        name: body.name.trim(),
        designation: body.designation.trim(),
        department: body.department || "Administration",
        qualification: body.qualification || "",
        image: body.image || "",
        order: Number(body.order) || 0,
      }
    });
    return NextResponse.json(created, { headers: noStore });
  } catch (e: any) {
    console.error("Faculty POST Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500, headers: noStore });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400, headers: noStore });
    
    if (rest.order !== undefined) rest.order = Number(rest.order) || 0;
    if (rest.name) rest.name = rest.name.trim();
    if (rest.designation) rest.designation = rest.designation.trim();
    
    const updated = await prisma.faculty.update({
      where: { id: String(id) },
      data: rest,
    });
    return NextResponse.json(updated, { headers: noStore });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: noStore });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id");
    
    if (!id) {
      const body = await req.json().catch(() => null);
      if (body?.id) id = String(body.id);
    }

    if (!id) {
      return NextResponse.json({ error: "ID missing" }, { status: 400, headers: noStore });
    }

    await prisma.faculty.delete({ where: { id: String(id) } });
    return NextResponse.json({ success: true }, { headers: noStore });
  } catch (e: any) {
    console.error("DELETE Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500, headers: noStore });
  }
}