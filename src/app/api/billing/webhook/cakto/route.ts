import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';

export const runtime = 'nodejs';

/**
 * Webhook da Cakto: confirma o pagamento do plano ilimitado e ativa o plano
 * do usuário no Firestore (casando pelo e-mail do comprador com a conta
 * Firebase — o comprador precisa criar conta no app com o mesmo e-mail
 * usado na compra).
 *
 * IMPORTANTE: não conseguimos confirmar os nomes exatos dos campos que a
 * Cakto envia (docs bloqueadas neste ambiente). `extractField` tenta os
 * caminhos mais prováveis (`status`, `event`, `data.status`, `customer.email`
 * etc). Ao receber o primeiro webhook real, confira o payload nos logs e
 * ajuste as listas de chaves abaixo se necessário.
 */

const PAID_STATUSES = ['paid', 'approved', 'completed', 'compra aprovada', 'compra_aprovada', 'active'];
const CANCELED_STATUSES = ['refunded', 'refund', 'chargeback', 'canceled', 'cancelled', 'estorno', 'reembolso'];

function extractField(body: unknown, paths: string[]): string | undefined {
  for (const path of paths) {
    const val = path.split('.').reduce<unknown>((acc, key) => {
      if (acc && typeof acc === 'object' && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, body);
    if (typeof val === 'string' && val.trim()) return val.trim();
  }
  return undefined;
}

export async function POST(req: NextRequest) {
  const secret = process.env.CAKTO_WEBHOOK_SECRET;
  if (secret) {
    const provided = req.headers.get('x-cakto-secret') ?? req.nextUrl.searchParams.get('secret');
    if (provided !== secret) {
      return NextResponse.json({ error: 'invalid_secret' }, { status: 401 });
    }
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const status = (
    extractField(body, ['status', 'event', 'data.status', 'data.event']) ?? ''
  ).toLowerCase();
  const email = extractField(body, [
    'email',
    'customer.email',
    'data.customer.email',
    'buyer.email',
    'data.buyer.email',
  ]);

  const isPaid = PAID_STATUSES.some((s) => status.includes(s));
  const isCanceled = CANCELED_STATUSES.some((s) => status.includes(s));

  if (!email || (!isPaid && !isCanceled)) {
    return NextResponse.json({ received: true, ignored: true, status, hasEmail: Boolean(email) });
  }

  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({
      received: true,
      warning: 'FIREBASE_SERVICE_ACCOUNT_KEY não configurada — plano não foi atualizado.',
    });
  }

  try {
    const user = await getAdminAuth().getUserByEmail(email);

    if (isPaid) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 35); // margem sobre o ciclo mensal
      await getAdminDb()
        .collection('users')
        .doc(user.uid)
        .set(
          { plan: { status: 'active', provider: 'cakto', updatedAt: new Date(), expiresAt } },
          { merge: true }
        );
    } else {
      await getAdminDb()
        .collection('users')
        .doc(user.uid)
        .set({ plan: { status: 'canceled', provider: 'cakto', updatedAt: new Date() } }, { merge: true });
    }

    return NextResponse.json({ received: true, updated: true, uid: user.uid, status: isPaid ? 'active' : 'canceled' });
  } catch {
    return NextResponse.json({
      received: true,
      updated: false,
      message: `Nenhuma conta encontrada com o e-mail ${email}. O comprador precisa criar conta no app com o mesmo e-mail usado na compra na Cakto.`,
    });
  }
}
