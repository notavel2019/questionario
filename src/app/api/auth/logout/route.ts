import { NextRequest, NextResponse } from 'next/server';
import { sessionCookie } from '@/lib/session';

export function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/painel/gsc', req.url), 303);
  res.cookies.delete(sessionCookie.name);
  return res;
}
