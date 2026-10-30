import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { awake: true, time: new Date().toISOString() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("Keep-Alive Failed:", e);
    return NextResponse.json(
      { awake: false },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}