import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) return Response.json({ error: "No file" }, { status: 400 });

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`downloads/${Date.now()}-${file.name}`, file, { access: "public" });
      return Response.json({ url: blob.url });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replaceAll(" ", "-")}`;
    const dir = path.join(process.cwd(), "public/downloads");
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    await writeFile(filePath, buffer);
    return Response.json({ url: `/downloads/${fileName}` });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}