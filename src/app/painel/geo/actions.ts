'use server';

import { auditSite, type GeoResult } from '@/lib/geo';

export async function runGeoAudit(
  url: string,
): Promise<{ ok: true; result: GeoResult } | { ok: false; error: string }> {
  try {
    if (!url.trim()) return { ok: false, error: 'Informe o endereço do site.' };
    return { ok: true, result: await auditSite(url) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Erro ao auditar o site.' };
  }
}
