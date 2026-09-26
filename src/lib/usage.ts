import { NextRequest } from 'next/server';
import { getAdminAuth, getAdminDb, isFirebaseAdminConfigured } from './firebase/admin';

export const FREE_DAILY_LIMIT = 3;

export class LimitExceededError extends Error {
  resetAt: Date;
  constructor(resetAt: Date) {
    super('Limite diário de conversões grátis atingido.');
    this.resetAt = resetAt;
  }
}

function todayKeySaoPaulo(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(now); // YYYY-MM-DD
}

function nextMidnightSaoPaulo(): Date {
  const now = new Date();
  const saoPauloOffsetHours = -3;
  const utcNow = new Date(now.getTime());
  const spNow = new Date(utcNow.getTime() + saoPauloOffsetHours * 3600 * 1000);
  const nextMidnightSp = new Date(
    Date.UTC(spNow.getUTCFullYear(), spNow.getUTCMonth(), spNow.getUTCDate() + 1, 0, 0, 0)
  );
  return new Date(nextMidnightSp.getTime() - saoPauloOffsetHours * 3600 * 1000);
}

async function resolveIdentity(req: NextRequest): Promise<{ id: string; uid: string | null }> {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ') && isFirebaseAdminConfigured()) {
    try {
      const token = authHeader.slice('Bearer '.length);
      const decoded = await getAdminAuth().verifyIdToken(token);
      return { id: `uid:${decoded.uid}`, uid: decoded.uid };
    } catch {
      // token inválido — cai para identificação por IP
    }
  }
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous';
  return { id: `ip:${ip}`, uid: null };
}

async function isPaidUser(uid: string | null): Promise<boolean> {
  if (!uid || !isFirebaseAdminConfigured()) return false;
  const doc = await getAdminDb().collection('users').doc(uid).get();
  const data = doc.data();
  if (!data?.plan) return false;
  if (data.plan.status !== 'active') return false;
  if (data.plan.expiresAt && data.plan.expiresAt.toDate() < new Date()) return false;
  return true;
}

export type UsageStatus = {
  used: number;
  limit: number;
  isPaid: boolean;
  resetAt: string;
};

export async function getUsageStatus(req: NextRequest): Promise<UsageStatus> {
  const { id, uid } = await resolveIdentity(req);
  const resetAt = nextMidnightSaoPaulo().toISOString();
  const paid = await isPaidUser(uid);

  if (!isFirebaseAdminConfigured()) {
    return { used: 0, limit: FREE_DAILY_LIMIT, isPaid: paid, resetAt };
  }

  const key = `${id}_${todayKeySaoPaulo()}`;
  const doc = await getAdminDb().collection('usage').doc(key).get();
  const used = doc.exists ? (doc.data()?.count ?? 0) : 0;

  return { used, limit: FREE_DAILY_LIMIT, isPaid: paid, resetAt };
}

/** Verifica o limite e incrementa o contador diário de forma atômica. Lança LimitExceededError se o limite grátis foi atingido. */
export async function checkAndConsumeQuota(req: NextRequest): Promise<void> {
  if (!isFirebaseAdminConfigured()) {
    // Ambiente sem Firebase configurado (ex. dev local) — não aplica limite.
    return;
  }

  const { id, uid } = await resolveIdentity(req);
  const paid = await isPaidUser(uid);
  if (paid) return;

  const db = getAdminDb();
  const key = `${id}_${todayKeySaoPaulo()}`;
  const ref = db.collection('usage').doc(key);
  const resetAt = nextMidnightSaoPaulo();

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists ? (snap.data()?.count ?? 0) : 0;
    if (current >= FREE_DAILY_LIMIT) {
      throw new LimitExceededError(resetAt);
    }
    tx.set(ref, { count: current + 1, updatedAt: new Date() }, { merge: true });
  });
}
