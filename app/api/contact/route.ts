import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const defaultData = {
  address: "Gulistan Town, Quetta, Balochistan",
  phone: "081-2669085",
  email: "mubarakali.mk.35@gmail.com",
  mapLink: "https://www.google.com/maps?q=Govt+General+Muhammad+Musa+Postgraduate+College+Quetta&z=15&output=embed",
  principalName: "",
  principalMsg: "",
  principalImage: ""
};

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    let data = await prisma.contactInfo.findFirst({ orderBy: { id: 'asc' } });
    if (!data) {
      try {
        data = await prisma.contactInfo.create({ data: defaultData });
      } catch {
        // race condition - dobara fetch
        data = await prisma.contactInfo.findFirst({ orderBy: { id: 'asc' } });
      }
    }
    return NextResponse.json(data || defaultData, { headers: noStore });
  } catch (e) {
    console.error(e);
    // ✅ FIX: defaultData ki jagah 503 bhejo taake cache overwrite na ho
    return NextResponse.json({ error: "DB offline", offline: true }, { status: 503, headers: noStore });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const existing = await prisma.contactInfo.findFirst({ orderBy: { id: 'asc' } });

    // Safe merge - jo field nahi bheja usko null mat karo, purana rakho
    const dataToSave: any = {};
    if (body.address !== undefined) dataToSave.address = body.address;
    if (body.phone !== undefined) dataToSave.phone = body.phone;
    if (body.email !== undefined) dataToSave.email = body.email;
    if (body.mapLink || body.mapUrl) dataToSave.mapLink = body.mapLink || body.mapUrl;
    if (body.principalName !== undefined) dataToSave.principalName = body.principalName || null;
    if (body.principalMsg !== undefined) dataToSave.principalMsg = body.principalMsg || null;
    if (body.principalImage !== undefined) dataToSave.principalImage = body.principalImage || null;

    if(Object.keys(dataToSave).length === 0){
      return NextResponse.json({ success: false, error: "No data to save" }, { status: 400 });
    }

    let saved;
    if (existing) {
      saved = await prisma.contactInfo.update({
        where: { id: existing.id },
        data: dataToSave
      });
    } else {
      saved = await prisma.contactInfo.create({
        data: { ...defaultData, ...dataToSave }
      });
    }

    return NextResponse.json({ success: true, data: saved }, { headers: noStore });
  } catch (e: any) {
    console.error("Contact POST Error:", e.message);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}