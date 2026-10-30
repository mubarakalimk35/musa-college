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

const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const hero = await prisma.homeHero.findMany({ orderBy: { order: 'asc' } });
    const stats = await prisma.homeStats.findMany({ orderBy: { order: 'asc' } });

    // Agar DB khali hai to fallback stats bhejo taake home khali na lage
    const finalStats = stats.length === 0 ? fallbackData.stats : stats;

    return NextResponse.json({ hero, stats: finalStats }, {
      headers: noStore
    });
  } catch (e) {
    console.error("Home GET Error:", e);
    return NextResponse.json({ error: "DB offline", offline: true, hero: [], stats: [] }, { status: 503, headers: noStore });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // ✅ Transaction - delete + create ek saath, fail hua to rollback, data safe
    await prisma.$transaction(async (tx) => {
      if (body.hero !== undefined) {
        if (!Array.isArray(body.hero)) throw new Error("Invalid hero data");
        if (body.hero.length > 16) throw new Error("Max 16 slides allowed");
        
        await tx.homeHero.deleteMany({});
        if (body.hero.length > 0) {
          await tx.homeHero.createMany({
            data: body.hero.map((h: any, i: number) => ({
              image: String(h.image || "").trim(),
              order: typeof h.order === 'number' ? Math.floor(h.order) : i + 1,
            })).filter((h:any) => h.image.length > 0)
          });
        }
      }

      if (body.stats !== undefined) {
        if (!Array.isArray(body.stats)) throw new Error("Invalid stats data");
        if (body.stats.length !== 4) throw new Error("Stats must be 4 items");

        await tx.homeStats.deleteMany({});
        await tx.homeStats.createMany({
          data: body.stats.map((s: any, i: number) => ({
            label: String(s.label || "").trim().slice(0, 30),
            value: String(s.value || "").trim().slice(0, 20),
            order: i + 1
          })).filter((s:any) => s.label && s.value)
        });
      }
    });

    return NextResponse.json({ success: true }, { headers: noStore });
  } catch (e: any) {
    console.error("Home POST Error:", e.message);
    return NextResponse.json({ error: e.message || "Save failed" }, { status: 400, headers: noStore });
  }
}