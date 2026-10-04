import { NextRequest, NextResponse } from 'next/server';
import { emailFromIdToken, exchangeCode, googleConfigured } from '@/lib/google';
import { seal, sessionCookie } from '@/lib/session';

export async function GET(req: NextRequest) {
  const back = (q = '') => NextResponse.redirect(new URL(`/painel/gsc${q}`, req.nextUrl.origin));
  if (!googleConfigured()) return back();
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const expected = req.cookies.get('pp_oauth_state')?.value;
  if (!code || !state || state !== expected) return back('?erro=estado');
  try {
    const t = await exchangeCode(code, req.nextUrl.origin);
    if (!t.refresh_token) return back('?erro=sem_refresh');
    const res = back();
    res.cookies.set(sessionCookie.name, seal({ refreshToken: t.refresh_token, email: emailFromIdToken(t.id_token) }), sessionCookie.options);
    res.cookies.delete('pp_oauth_state');
    return res;
  } catch {
    return back('?erro=token');
  }
}
