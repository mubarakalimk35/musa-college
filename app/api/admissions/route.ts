import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const time = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    
    const createdAt = `${date} ${time}`;

    const admission = await prisma.admission.create({
      data: {
        program: body.program,
        studentName: body.studentName,
        fatherName: body.fatherName,
        dob: body.dob,
        cnic: body.cnic,
        religion: body.religion,
        nationality: body.nationality,
        domicile: body.domicile,
        mobile: body.mobile,
        address: body.address,
        createdAt: createdAt,
        status: "Pending",
      }
    });
    return NextResponse.json({ success: true, data: admission });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const admissions = await prisma.admission.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(admissions);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}