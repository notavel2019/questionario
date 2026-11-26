'use server';

import { prayerSchema, type PrayerValues } from '@/lib/prayer-schema';

export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Recebe os pedidos de oração. Valida no servidor (nunca confie só no cliente).
 * TODO: encaminhar `data` para o destino real (e-mail, planilha, banco ou webhook).
 */
export async function submitPrayerRequest(input: unknown): Promise<SubmitResult> {
  const parsed = prayerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Revise os campos destacados e tente novamente.' };
  }
  const data: PrayerValues = parsed.data;
  console.info('[prayer-request] nova submissão recebida', { areas: Object.keys(data).filter((k) => data[k as keyof PrayerValues]) });
  return { ok: true };
}
