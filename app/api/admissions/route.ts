import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Pehle try karo normal model se - sab se fast
    if ((prisma as any).admission) {
      const data = await (prisma as any).admission.findMany({
        orderBy: { id: 'desc' },
      });
      if (data && data.length > 0) {
        return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
      }
    }
  } catch (e) {
    console.log("Model fail, trying raw query");
  }

  try {
    // Agar model fail ho jaye to direct table se lo - ye kabhi khali nahi chhorega
    const data: any = await prisma.$queryRawUnsafe(`SELECT * FROM "admissions" ORDER BY id DESC`);
    const safe = JSON.parse(JSON.stringify(data, (k, v) => typeof v === 'bigint' ? v.toString() : v));
    return NextResponse.json(safe, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    console.error("Admission GET Error:", e.message);
    // Last me bhi error nahi dena, khali array dena taake admin panel crash na ho
    return NextResponse.json([], { headers: { "Cache-Control": "no-store" } });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { program, studentName, fatherName, dob, cnic, religion, nationality, domicile, mobile, address } = body;

    if (!program || !studentName || !cnic) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Secure insert - $queryRaw with params - SQL injection safe
    await prisma.$queryRaw`INSERT INTO "admissions" ("program","studentName","fatherName","dob","cnic","religion","nationality","domicile","mobile","address","status","createdAt") VALUES (${program}, ${studentName}, ${fatherName}, ${dob}, ${String(cnic)}, ${religion}, ${nationality}, ${domicile}, ${String(mobile)}, ${address}, 'PENDING', ${new Date().toISOString()})`;

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    await prisma.$queryRaw`UPDATE "admissions" SET "status" = ${status} WHERE id = ${Number(id)}`;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await prisma.$queryRaw`DELETE FROM "admissions" WHERE id = ${Number(id)}`;
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}