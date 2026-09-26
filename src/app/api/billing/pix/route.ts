import { NextRequest, NextResponse } from 'next/server';

/**
 * Cria uma cobrança PIX via Mercado Pago para o plano ilimitado.
 * Requer MERCADOPAGO_ACCESS_TOKEN configurado (produção). Sem a chave,
 * retorna 501 para deixar claro que o gateway ainda não foi ligado.
 */

const PLAN_PRICE_MONTHLY = Number(process.env.PLAN_PRICE_MONTHLY ?? '19.9');
const PLAN_PRICE_LAUNCH = Number(process.env.PLAN_PRICE_LAUNCH ?? '9.9');

export async function POST(req: NextRequest) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return NextResponse.json(
      {
        error: 'billing_not_configured',
        message:
          'Cobrança PIX ainda não configurada neste ambiente. Defina MERCADOPAGO_ACCESS_TOKEN para ativar o checkout.',
      },
      { status: 501 }
    );
  }

  const { email, isFirstSubscription } = (await req.json().catch(() => ({}))) as {
    email?: string;
    isFirstSubscription?: boolean;
  };

  if (!email) {
    return NextResponse.json({ error: 'missing_email', message: 'E-mail é obrigatório.' }, { status: 400 });
  }

  const amount = isFirstSubscription ? PLAN_PRICE_LAUNCH : PLAN_PRICE_MONTHLY;

  const response = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify({
      transaction_amount: amount,
      description: 'Conversor de Etiquetas Notável — plano ilimitado (mensal)',
      payment_method_id: 'pix',
      payer: { email },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return NextResponse.json(
      { error: 'mercadopago_error', message: 'Falha ao gerar cobrança PIX.', detail },
      { status: 502 }
    );
  }

  const data = await response.json();
  const pix = data.point_of_interaction?.transaction_data;

  return NextResponse.json({
    paymentId: data.id,
    status: data.status,
    qrCode: pix?.qr_code,
    qrCodeBase64: pix?.qr_code_base64,
    ticketUrl: pix?.ticket_url,
    amount,
  });
}
