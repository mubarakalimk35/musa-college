import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const isAdmin = request.cookies.get('admin_auth')?.value === 'true';
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // Agar login nahi hai aur admin page khol raha hai
  if (!isAdmin && isAdminPage && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Agar login hai aur phir se login page khol raha hai
  if (isAdmin && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};