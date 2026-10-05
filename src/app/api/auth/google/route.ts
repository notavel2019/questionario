import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { authUrl, googleConfigured } from '@/lib/google';

export function GET(req: NextRequest) {
  if (!googleConfigured()) return NextResponse.redirect(new URL('/painel/gsc', req.url));
  const state = randomBytes(16).toString('hex');
  const res = NextResponse.redirect(authUrl(req.nextUrl.origin, state));
  res.cookies.set('pp_oauth_state', state, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 600, secure: process.env.NODE_ENV === 'production' });
  return res;
}
