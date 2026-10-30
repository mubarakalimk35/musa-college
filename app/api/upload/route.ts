import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs"; // FIX: Sharp ko Edge par crash hone se bachata hai

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") || "downloads";
    
    const form = await req.formData();
    const file = form.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (Max 10MB)" }, { status: 400 });
    }

    const allowed = [
      "hero", "contact", "news", "events", "faculty", 
      "downloads", "notices", "gallery", "principal", "about"
    ];
    const safeFolder = allowed.includes(folder) ? folder : "downloads";

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    let contentType = file.type;
    let finalFileName = "";

    const safeName = file.name.replaceAll(" ", "-").replace(/[^a-zA-Z0-9.-]/g, "");

    if (file.type.startsWith("image/")) {
      try {
        buffer = await sharp(buffer)
          .resize({ width: 1280, withoutEnlargement: true })
          .webp({ quality: 75 })
          .toBuffer();
        contentType = "image/webp";
        finalFileName = `${Date.now()}-${safeName.split(".")[0]}.webp`;
      } catch (e) {
        console.log("WebP convert failed, using original");
        finalFileName = `${Date.now()}-${safeName}`;
      }
    } else {
      // PDF / Docs - original hi rehne do
      finalFileName = `${Date.now()}-${safeName}`;
    }

    // Vercel Blob - Permanent Storage
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`${safeFolder}/${finalFileName}`, buffer, { 
        access: "public",
        contentType: contentType, // FIX: PDF sahi khulega
      });
      return NextResponse.json({ url: blob.url });
    }

    // Local dev fallback
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const dir = path.join(process.cwd(), `public/${safeFolder}`);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, finalFileName);
    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/${safeFolder}/${finalFileName}` });

  } catch (e: any) {
    console.error("Upload Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}