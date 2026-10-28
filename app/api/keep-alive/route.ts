import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Neon ko jagane ke liye halka query
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ awake: true, time: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json({ awake: false }, { status: 500 });
  }
}