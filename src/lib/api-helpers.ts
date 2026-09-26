import { NextRequest, NextResponse } from 'next/server';
import { checkAndConsumeQuota, LimitExceededError } from './usage';

export function bufferToBase64(buf: Uint8Array): string {
  return Buffer.from(buf).toString('base64');
}

export async function withQuota(
  req: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    await checkAndConsumeQuota(req);
  } catch (err) {
    if (err instanceof LimitExceededError) {
      return NextResponse.json(
        {
          error: 'limit_exceeded',
          message: 'Você atingiu o limite de 3 conversões grátis hoje. Assine o plano ilimitado para continuar.',
          resetAt: err.resetAt.toISOString(),
        },
        { status: 429 }
      );
    }
    throw err;
  }

  try {
    return await handler();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro inesperado ao converter o arquivo.';
    return NextResponse.json({ error: 'conversion_failed', message }, { status: 400 });
  }
}
