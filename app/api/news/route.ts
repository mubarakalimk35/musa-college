import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "news.json");

// ensure folder
const ensureFile = () => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
};

export async function GET() {
  ensureFile();
  const data = fs.readFileSync(filePath, "utf-8");
  return NextResponse.json(JSON.parse(data));
}

export async function POST(req: Request) {
  ensureFile();
  const body = await req.json();
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  data.unshift(body); // latest first
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  ensureFile();
  const { id } = await req.json();
  let data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  data = data.filter((n: any) => n.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}