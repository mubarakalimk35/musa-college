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

export async function GET() {
  try {
    let data = await prisma.contactInfo.findFirst();
    if (!data) {
      // Pehli baar default create kar do
      data = await prisma.contactInfo.create({ data: defaultData });
    }
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(defaultData);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body = { address, phone, email, mapLink, principalName, principalMsg, principalImage }
    
    const existing = await prisma.contactInfo.findFirst();
    
    let saved;
    if (existing) {
      saved = await prisma.contactInfo.update({
        where: { id: existing.id },
        data: {
          address: body.address,
          phone: body.phone,
          email: body.email,
          mapLink: body.mapLink || body.mapUrl,
          principalName: body.principalName || null,
          principalMsg: body.principalMsg || null,
          principalImage: body.principalImage || null,
        }
      });
    } else {
      saved = await prisma.contactInfo.create({
        data: {
          address: body.address,
          phone: body.phone,
          email: body.email,
          mapLink: body.mapLink || body.mapUrl,
          principalName: body.principalName || null,
          principalMsg: body.principalMsg || null,
          principalImage: body.principalImage || null,
        }
      });
    }

    return NextResponse.json({ success: true, data: saved });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}