import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { password } = await req.json();
  
  console.log("Env password:", process.env.ADMIN_PASSWORD); // debug ke liye

  if (password.trim() === process.env.ADMIN_PASSWORD?.trim()) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });
    return response;
  }
  
  return NextResponse.json({ success: false }, { status: 401 });
}