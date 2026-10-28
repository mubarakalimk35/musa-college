import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || "downloads";
    
    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    // File size check - 10MB se zyada nahi
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (Max 10MB)" }, { status: 400 });
    }

    const allowed = [
      "hero", "contact", "news", "events", "faculty", 
      "downloads", "notices", "gallery", "principal", "about"
    ];
    const safeFolder = allowed.includes(folder) ? folder : "downloads";

    // Vercel Blob - Ye permanent hai, delete nahi hoga
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`${safeFolder}/${Date.now()}-${file.name.replaceAll(" ", "-")}`, file, { 
        access: "public" 
      });
      return NextResponse.json({ url: blob.url });
    }

    // Agar local pe chala rahe ho to
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name.replaceAll(" ", "-")}`;
    const dir = path.join(process.cwd(), `public/${safeFolder}`);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, fileName);
    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/${safeFolder}/${fileName}` });

  } catch (e: any) {
    console.error("Upload Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}