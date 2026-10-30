import { NextRequest, NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; time: number }>();
const RATE_LIMIT = 60;
const WINDOW = 60 * 1000;

export function middleware(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "anon";
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (record && now - record.time < WINDOW) {
    if (record.count > RATE_LIMIT) {
      return new NextResponse("Too Many Requests", { status: 429 });
    }
    record.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, time: now });
  }

  const res = NextResponse.next();

  res.headers.set("X-DNS-Prefetch-Control", "on");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'self';"
  );

  const pathname = req.nextUrl.pathname;
  if (pathname.match(/\.(jpg|jpeg|png|webp|avif|svg|ico|js|css|woff2?)$/)) {
    res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (pathname.startsWith("/api/")) {
    if (pathname.includes("/admin") || pathname.includes("/admissions") || pathname.includes("/news")) {
      res.headers.set("Cache-Control", "no-store, must-revalidate");
    } else {
      res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};