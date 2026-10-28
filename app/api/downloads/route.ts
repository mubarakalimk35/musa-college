import { promises as fs } from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "public/downloads/list.json");

const fallbackDownloads = [
  {
    id: "1",
    title: "Admission Form 2025",
    fileUrl: "/downloads/admission-form.pdf",
    date: new Date().toISOString()
  }
];

export async function GET() {
  try {
    if (process.env.KV_REST_API_URL) {
      const { kv } = await import("@vercel/kv");
      const docs = (await kv.get("college_downloads") as any[]) || [];
      return Response.json(docs);
    }
    // Local ke liye
    const data = await fs.readFile(FILE_PATH, "utf-8").catch(() => "[]");
    const parsed = JSON.parse(data);
    return Response.json(parsed);
  } catch (e) {
    console.error("Download GET Error:", e);
    return Response.json(fallbackDownloads); // Neon/KV fail ho to bhi khali nahi
  }
}

export async function POST(req: Request) {
  const doc = await req.json();
  // ID aur date auto add karo taake frontend pe show ho
  const newDoc = {
    id: doc.id || Date.now().toString(),
    title: doc.title,
    fileUrl: doc.fileUrl || doc.url,
    date: new Date().toISOString(),
    ...doc
  };
  
  try {
    if (process.env.KV_REST_API_URL) {
      const { kv } = await import("@vercel/kv");
      const docs: any = (await kv.get("college_downloads") as any[]) || [];
      docs.unshift(newDoc);
      await kv.set("college_downloads", docs);
    } else {
      await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
      const data = await fs.readFile(FILE_PATH, "utf-8").catch(() => "[]");
      const docs = JSON.parse(data);
      docs.unshift(newDoc);
      await fs.writeFile(FILE_PATH, JSON.stringify(docs, null, 2));
    }
    return Response.json({ success: true });
  } catch (e: any) { 
    return Response.json({ error: e.message }, { status: 500 }); 
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  try {
    if (process.env.KV_REST_API_URL) {
      const { kv } = await import("@vercel/kv");
      const docs: any = (await kv.get("college_downloads") as any[]) || [];
      await kv.set("college_downloads", docs.filter((d: any) => d.id !== id));
    } else {
      const data = await fs.readFile(FILE_PATH, "utf-8").catch(() => "[]");
      const docs = JSON.parse(data);
      await fs.writeFile(FILE_PATH, JSON.stringify(docs.filter((d: any) => d.id !== id), null, 2));
    }
    return Response.json({ success: true });
  } catch (e: any) { 
    return Response.json({ error: e.message }, { status: 500 }); 
  }
}