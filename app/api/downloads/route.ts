import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const FILE_PATH = path.join(process.cwd(), "public/downloads/list.json");

const fallbackDownloads = [
  { id: "1", title: "Admission Form 2025", type: "Admission Form", file: "/downloads/admission-form.pdf", date: "2025-01-01" }
];

async function getKV() {
  if (!process.env.KV_REST_API_URL) return null;
  try {
    const { kv } = await import("@vercel/kv");
    return kv;
  } catch { return null; }
}

export async function GET() {
  try {
    let docs = fallbackDownloads;
    const kv = await getKV();
    
    if (kv) {
      try {
        docs = (await kv.get("college_downloads") as any[]) || fallbackDownloads;
      } catch { docs = fallbackDownloads; }
    } else {
      try {
        const data = await fs.readFile(FILE_PATH, "utf-8");
        docs = JSON.parse(data);
      } catch { docs = fallbackDownloads; }
    }

    const normalized = docs.map((d: any) => ({
      id: d.id, title: d.title, type: d.type || "General",
      file: d.file || d.fileUrl, date: d.date,
    }));

    return NextResponse.json(normalized, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json(fallbackDownloads);
  }
}

export async function POST(req: NextRequest) {
  const doc = await req.json();
  if (!doc.title?.trim() || (!doc.file && !doc.fileUrl)) {
    return NextResponse.json({ error: "Title and file required" }, { status: 400 });
  }

  const fileUrl = (doc.file || doc.fileUrl) as string;
  if (!fileUrl.startsWith("/") && !fileUrl.startsWith("https://")) {
    return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
  }

  const newDoc = {
    id: Date.now().toString(),
    title: doc.title.trim().slice(0, 100),
    type: (doc.type || "General").slice(0, 50),
    file: fileUrl,
    date: new Date().toISOString(),
  };
  
  const kv = await getKV();
  if (kv) {
    const docs = (await kv.get("college_downloads") as any[]) || [];
    docs.unshift(newDoc);
    await kv.set("college_downloads", docs);
  } else {
    await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
    const data = await fs.readFile(FILE_PATH, "utf-8").catch(() => "[]");
    const docs = JSON.parse(data);
    docs.unshift(newDoc);
    await fs.writeFile(FILE_PATH, JSON.stringify(docs, null, 2));
  }
  return NextResponse.json({ success: true, data: newDoc });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const kv = await getKV();
  if (kv) {
    const docs = (await kv.get("college_downloads") as any[]) || [];
    await kv.set("college_downloads", docs.filter((d: any) => d.id !== id));
  } else {
    const data = await fs.readFile(FILE_PATH, "utf-8").catch(() => "[]");
    const docs = JSON.parse(data);
    await fs.writeFile(FILE_PATH, JSON.stringify(docs.filter((d: any) => d.id !== id), null, 2));
  }
  return NextResponse.json({ success: true });
}