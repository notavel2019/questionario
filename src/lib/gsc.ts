import 'server-only';
import { accessTokenFromSession, googleConfigured } from './google';
import { readSession } from './session';
import { gscQueries, type QueryRow } from './demo-data';

export type GscData = {
  source: 'real' | 'demo';
  configured: boolean;
  email?: string;
  sites: string[];
  site?: string;
  rows: QueryRow[];
  error?: string;
};

const API = 'https://www.googleapis.com/webmasters/v3';

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function getGscData(requestedSite?: string): Promise<GscData> {
  const demo: GscData = { source: 'demo', configured: googleConfigured(), sites: [], rows: gscQueries };
  if (!demo.configured) return demo;
  const session = readSession();
  const token = await accessTokenFromSession();
  if (!session || !token) return demo;

  const auth = { Authorization: `Bearer ${token}` };
  try {
    const sitesRes = await fetch(`${API}/sites`, { headers: auth, cache: 'no-store' });
    if (!sitesRes.ok) throw new Error(`Search Console recusou a consulta (${sitesRes.status}).`);
    const sites: string[] = ((await sitesRes.json()).siteEntry ?? [])
      .filter((s: { permissionLevel: string }) => s.permissionLevel !== 'siteUnverifiedUser')
      .map((s: { siteUrl: string }) => s.siteUrl);
    const site = requestedSite && sites.includes(requestedSite) ? requestedSite : sites[0];
    if (!site) return { ...demo, source: 'real', email: session.email, sites, rows: [], error: 'Nenhuma propriedade verificada nesta conta do Google.' };

    const end = new Date(Date.now() - 3 * 86400000); // dados do GSC têm ~2-3 dias de atraso
    const start = new Date(end.getTime() - 27 * 86400000);
    const q = await fetch(`${API}/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ startDate: iso(start), endDate: iso(end), dimensions: ['query'], rowLimit: 100 }),
      cache: 'no-store',
    });
    if (!q.ok) throw new Error(`Falha ao buscar consultas (${q.status}).`);
    const rows: QueryRow[] = ((await q.json()).rows ?? []).map(
      (r: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }) => ({
        query: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: Math.round(r.ctr * 1000) / 10,
        position: r.position,
      }),
    );
    return { source: 'real', configured: true, email: session.email, sites, site, rows };
  } catch (e) {
    return { ...demo, error: e instanceof Error ? e.message : 'Erro ao consultar o Search Console.' };
  }
}
