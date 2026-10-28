import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const fallbackData = {
  hero: [],
  stats: [
    { id: "1", label: "Students", value: "2000+", order: 1 },
    { id: "2", label: "Faculty", value: "50+", order: 2 },
    { id: "3", label: "Programs", value: "9", order: 3 },
    { id: "4", label: "Established", value: "1987", order: 4 },
  ]
};

export async function GET() {
  try {
    const hero = await prisma.homeHero.findMany({ orderBy: { order: 'asc' } });
    const stats = await prisma.homeStats.findMany({ orderBy: { order: 'asc' } });

    return NextResponse.json({ hero, stats }, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (e) {
    console.error("Home GET Error:", e);
    // IMPORTANT: Error pe khali nahi, fallback bhejo taake home khali na lage
    return NextResponse.json(fallbackData, {
      headers: { "Cache-Control": "no-store" }
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    if (body.hero !== undefined) {
      await prisma.homeHero.deleteMany({});
      if (body.hero.length > 0) {
        await prisma.homeHero.createMany({
          data: body.hero.map((h: any, i: number) => ({
            image: h.image,
            order: typeof h.order === 'number' ? h.order : i,
          }))
        });
      }
    }

    if (body.stats !== undefined) {
      await prisma.homeStats.deleteMany({});
      if (body.stats.length > 0) {
        await prisma.homeStats.createMany({
          data: body.stats.map((s: any, i: number) => ({
            label: s.label,
            value: s.value,
            order: i
          }))
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}