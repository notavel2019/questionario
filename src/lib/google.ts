import 'server-only';
import { readSession } from './session';

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/webmasters.readonly',
  'openid',
  'email',
];

export function googleConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.SESSION_SECRET);
}

export function redirectUri(origin: string): string {
  return `${process.env.APP_URL || origin}/api/auth/google/callback`;
}

export function authUrl(origin: string, state: string): string {
  const p = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri(origin),
    response_type: 'code',
    scope: GOOGLE_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p}`;
}

type TokenResponse = { access_token: string; refresh_token?: string; id_token?: string };

async function tokenRequest(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      ...body,
    }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Falha na autenticação com o Google (${res.status}).`);
  return res.json();
}

export function exchangeCode(code: string, origin: string) {
  return tokenRequest({ code, grant_type: 'authorization_code', redirect_uri: redirectUri(origin) });
}

export async function accessTokenFromSession(): Promise<string | null> {
  const s = readSession();
  if (!s) return null;
  try {
    return (await tokenRequest({ refresh_token: s.refreshToken, grant_type: 'refresh_token' })).access_token;
  } catch {
    return null;
  }
}

export function emailFromIdToken(idToken?: string): string | undefined {
  if (!idToken) return undefined;
  try {
    return JSON.parse(Buffer.from(idToken.split('.')[1], 'base64url').toString()).email;
  } catch {
    return undefined;
  }
}
