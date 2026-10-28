import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const fallbackFaculty = [
  { 
    id: "1", 
    name: "Prof. Mubarak Ali", 
    designation: "Principal", 
    department: "Administration",
    qualification: "M.A",
    image: "",
    order: 1 
  }
];

export async function GET() {
  try {
    const data = await prisma.faculty.findMany({ 
      orderBy: { order: 'asc' } 
    });
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (e) {
    console.error("Faculty GET Error:", e);
    return NextResponse.json(fallbackFaculty);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await prisma.faculty.create({
      data: {
        name: body.name,
        designation: body.designation,
        department: body.department || "General",
        qualification: body.qualification || "",
        image: body.image || "",
        order: Number(body.order) || 0,
      }
    });
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (rest.order) rest.order = Number(rest.order);
    
    const updated = await prisma.faculty.update({
      where: { id },
      data: rest,
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id");
    
    if (!id) {
      const body = await req.json().catch(() => null);
      if (body?.id) id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: "ID missing" }, { status: 400 });
    }

    console.log("Deleting Faculty ID:", id);

    await prisma.faculty.delete({ where: { id: String(id) } });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("DELETE Error:", e.message);
    try {
        const url = new URL(req.url);
        let id = url.searchParams.get("id");
        if(!id){
           const b = await req.json().catch(()=>null);
        }
        await prisma.faculty.delete({ where: { id: Number(id) } as any });
        return NextResponse.json({ success: true });
    } catch (e2: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
}