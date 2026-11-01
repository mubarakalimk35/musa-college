import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    if ((prisma as any).admission) {
      const data = await (prisma as any).admission.findMany({ orderBy: { id: 'desc' } });
      if (data?.length) return NextResponse.json(data, { headers: noStore });
    }
  } catch {}
  try {
    const data: any = await prisma.$queryRawUnsafe(`SELECT * FROM "admissions" ORDER BY id DESC`);
    const safe = JSON.parse(JSON.stringify(data, (_k, v) => typeof v === 'bigint' ? v.toString() : v));
    return NextResponse.json(safe, { headers: noStore });
  } catch (e: any) {
    console.error("Admission GET Error:", e.message);
    return NextResponse.json({ error: "DB offline", offline: true }, { status: 503, headers: noStore });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (body._method === "PATCH") {
      return handlePatch(body.id, body.status);
    }
    if (body._method === "DELETE") {
      return handleDelete(body.id);
    }

    const { program, studentName, fatherName, dob, cnic, religion, nationality, domicile, mobile, address } = body;
    if (!program || !studentName || !cnic) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ FIX: dob text (16/11/2026) ko Date me convert karo
    let parsedDob: Date | null = null;
    if (dob) {
      if (typeof dob === 'string' && dob.includes('/')) {
        const [d, m, y] = dob.split('/');
        parsedDob = new Date(`${y}-${m}-${d}`);
      } else {
        parsedDob = new Date(dob);
      }
    }

    const now = new Date();

    await prisma.$queryRaw`INSERT INTO "admissions" ("program","studentName","fatherName","dob","cnic","religion","nationality","domicile","mobile","address","status","createdAt","updatedAt") VALUES (${program}, ${studentName}, ${fatherName}, ${parsedDob}, ${String(cnic)}, ${religion}, ${nationality}, ${domicile}, ${String(mobile)}, ${address}, 'PENDING', ${now}, ${now})`;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

async function handlePatch(id: any, status: any) {
  if(!id || !status) return NextResponse.json({ error: "Missing id/status" }, { status: 400 });
  const allowed = ['PENDING','APPROVED','REJECTED'];
  if(!allowed.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  await prisma.$queryRaw`UPDATE "admissions" SET "status" = ${status}, "updatedAt" = ${new Date()} WHERE id = ${Number(id)}`;
  return NextResponse.json({ success: true });
}

async function handleDelete(id: any) {
  if(!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.$queryRaw`DELETE FROM "admissions" WHERE id = ${Number(id)}`;
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    return handlePatch(id, status);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id");
    if(!id) {
      try { const b = await req.json(); id = b.id; } catch {}
    }
    return handleDelete(id);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}