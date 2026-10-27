import { promises as fs } from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "public/downloads/list.json");

export async function GET() {
  try {
    if (process.env.KV_REST_API_URL) {
      const { kv } = await import("@vercel/kv");
      const docs = (await kv.get("college_downloads")) || [];
      return Response.json(docs);
    }
    const data = await fs.readFile(FILE_PATH, "utf-8").catch(() => "[]");
    return Response.json(JSON.parse(data));
  } catch { return Response.json([]); }
}

export async function POST(req: Request) {
  const doc = await req.json();
  try {
    if (process.env.KV_REST_API_URL) {
      const { kv } = await import("@vercel/kv");
      const docs: any = (await kv.get("college_downloads") as any[]) || [];
      docs.unshift(doc);
      await kv.set("college_downloads", docs);
    } else {
      await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
      const data = await fs.readFile(FILE_PATH, "utf-8").catch(() => "[]");
      const docs = JSON.parse(data);
      docs.unshift(doc);
      await fs.writeFile(FILE_PATH, JSON.stringify(docs, null, 2));
    }
    return Response.json({ success: true });
  } catch (e: any) { return Response.json({ error: e.message }, { status: 500 }); }
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
  } catch (e: any) { return Response.json({ error: e.message }, { status: 500 }); }
}