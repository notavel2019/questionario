import 'server-only';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';

export type GoogleSession = { refreshToken: string; email?: string };

const COOKIE = 'pp_session';

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) throw new Error('SESSION_SECRET ausente ou curto demais (mínimo 16 caracteres).');
  return createHash('sha256').update(secret).digest();
}

export function seal(data: GoogleSession): string {
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([c.update(JSON.stringify(data), 'utf8'), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString('base64url');
}

export function unseal(value: string): GoogleSession | null {
  try {
    const buf = Buffer.from(value, 'base64url');
    const d = createDecipheriv('aes-256-gcm', key(), buf.subarray(0, 12));
    d.setAuthTag(buf.subarray(12, 28));
    return JSON.parse(Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString('utf8'));
  } catch {
    return null;
  }
}

export function readSession(): GoogleSession | null {
  const v = cookies().get(COOKIE)?.value;
  return v ? unseal(v) : null;
}

export const sessionCookie = {
  name: COOKIE,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  },
};
