import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data: any = await prisma.$queryRawUnsafe(`SELECT * FROM "admissions" ORDER BY id DESC`);
    const safe = JSON.parse(JSON.stringify(data, (k,v)=> typeof v === 'bigint' ? v.toString() : v));
    return NextResponse.json(safe);
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming:", body);

    // Safe insert - single quote issue khatam
    const { program, studentName, fatherName, dob, cnic, religion, nationality, domicile, mobile, address } = body;

    if (!program || !studentName || !cnic) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdAt = new Date().toLocaleString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true });

    // Use Prisma's create - ye sabse safe hai
    const result = await prisma.$executeRawUnsafe(
      `INSERT INTO "admissions" ("program","studentName","fatherName","dob","cnic","religion","nationality","domicile","mobile","address","status","createdAt") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      program, studentName, fatherName, dob, String(cnic), religion, nationality, domicile, String(mobile), address, "PENDING", createdAt
    );

    // Agar $executeRawUnsafe $1 wala support na kare to fallback
    return NextResponse.json({ success: true });

  } catch (e:any) {
    console.error("SAVE FAILED:", e.message);
    // Fallback - agar upar wala fail ho to simple unsafe try
    try {
      const body = await req.json().catch(()=>null);
      if(!body) throw e;
      const createdAt = new Date().toLocaleString();
      const safe = (s:any) => String(s || "").replace(/'/g, "''");
      await prisma.$queryRawUnsafe(`
        INSERT INTO "admissions" ("program","studentName","fatherName","dob","cnic","religion","nationality","domicile","mobile","address","status","createdAt")
        VALUES ('${safe(body.program)}','${safe(body.studentName)}','${safe(body.fatherName)}','${safe(body.dob)}','${safe(body.cnic)}','${safe(body.religion)}','${safe(body.nationality)}','${safe(body.domicile)}','${safe(body.mobile)}','${safe(body.address)}','PENDING','${createdAt}')
      `);
      return NextResponse.json({ success: true });
    } catch (err:any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }
}

export async function PATCH(req: Request) {
  const { id, status } = await req.json();
  await prisma.$queryRawUnsafe(`UPDATE "admissions" SET "status" = '${status}' WHERE id = ${Number(id)}`);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await prisma.$queryRawUnsafe(`DELETE FROM "admissions" WHERE id = ${Number(id)}`);
  return NextResponse.json({ success: true });
}