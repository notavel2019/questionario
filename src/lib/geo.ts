export type GeoCheck = { id: string; label: string; weight: number; passed: boolean; tip: string };
export type GeoResult = { url: string; score: number; checks: GeoCheck[] };

const AI_BOTS = ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'];

export function normalizeUrl(input: string): URL {
  const raw = /^https?:\/\//i.test(input.trim()) ? input.trim() : `https://${input.trim()}`;
  const url = new URL(raw);
  const host = url.hostname;
  if (
    !host.includes('.') ||
    /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|\[)/i.test(host)
  ) {
    throw new Error('Endereço inválido.');
  }
  return url;
}

async function get(url: string): Promise<{ ok: boolean; text: string }> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'PrimeiraPaginaBot/1.0' },
      cache: 'no-store',
    });
    return { ok: res.ok, text: (await res.text()).slice(0, 1_000_000) };
  } catch {
    return { ok: false, text: '' };
  }
}

function blocksAiBots(robots: string): boolean {
  let current: string[] = [];
  let lastWasAgent = false;
  for (const line of robots.split('\n')) {
    const [k, ...rest] = line.split('#')[0].split(':');
    const key = k.trim().toLowerCase();
    const val = rest.join(':').trim();
    if (key === 'user-agent') {
      current = lastWasAgent ? [...current, val.toLowerCase()] : [val.toLowerCase()];
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (key === 'disallow' && val === '/') {
      if (current.some((a) => AI_BOTS.some((b) => b.toLowerCase() === a))) return true;
    }
  }
  return false;
}

export async function auditSite(input: string): Promise<GeoResult> {
  const url = normalizeUrl(input);
  const origin = url.origin;
  const [page, robots, llms] = await Promise.all([
    get(url.toString()),
    get(`${origin}/robots.txt`),
    get(`${origin}/llms.txt`),
  ]);
  if (!page.ok) throw new Error('Não foi possível acessar o site.');
  const html = page.text;

  const has = (re: RegExp) => re.test(html);
  const h2h3 = [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').trim(),
  );
  const questions = h2h3.filter((h) => h.includes('?')).length;
  const text = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;

  const checks: GeoCheck[] = [
    { id: 'https', label: 'Usa HTTPS', weight: 5, passed: url.protocol === 'https:', tip: 'Instale um certificado SSL.' },
    { id: 'title', label: 'Título da página definido', weight: 8, passed: has(/<title>\s*\S/i), tip: 'Adicione um <title> claro com o tema principal.' },
    { id: 'description', label: 'Meta description', weight: 8, passed: has(/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{50,}/i), tip: 'Escreva uma meta description de 50+ caracteres que responda o que a página oferece.' },
    { id: 'h1', label: 'Um H1 na página', weight: 7, passed: (html.match(/<h1[\s>]/gi) || []).length === 1, tip: 'Use exatamente um H1 descrevendo o assunto.' },
    { id: 'lang', label: 'Idioma declarado', weight: 3, passed: has(/<html[^>]+lang=/i), tip: 'Defina o atributo lang no <html>.' },
    { id: 'canonical', label: 'URL canônica', weight: 4, passed: has(/<link[^>]+rel=["']canonical["']/i), tip: 'Adicione <link rel="canonical">.' },
    { id: 'schema', label: 'Dados estruturados (JSON-LD)', weight: 15, passed: has(/application\/ld\+json/i), tip: 'Adicione schema.org (Organization, FAQPage, Article) em JSON-LD.' },
    { id: 'faq', label: 'Títulos em formato de pergunta', weight: 12, passed: questions >= 2, tip: 'Use H2/H3 em forma de pergunta seguidos de resposta direta.' },
    { id: 'depth', label: 'Conteúdo com profundidade (300+ palavras)', weight: 8, passed: words >= 300, tip: 'Aprofunde o conteúdo com respostas completas.' },
    { id: 'author', label: 'Autoria ou organização identificada', weight: 6, passed: has(/rel=["']author["']|name=["']author["']|"author"|"@type"\s*:\s*"Organization"/i), tip: 'Identifique autor/empresa (E-E-A-T).' },
    { id: 'og', label: 'Open Graph', weight: 4, passed: has(/property=["']og:title["']/i), tip: 'Adicione tags og:title e og:description.' },
    { id: 'robots', label: 'Não bloqueia bots de IA', weight: 10, passed: !(robots.ok && blocksAiBots(robots.text)), tip: 'Libere GPTBot, ClaudeBot e PerplexityBot no robots.txt.' },
    { id: 'llms', label: 'Arquivo llms.txt', weight: 10, passed: llms.ok && llms.text.trim().length > 20 && !/<html/i.test(llms.text), tip: 'Publique /llms.txt resumindo o site para IAs.' },
  ];

  const total = checks.reduce((s, c) => s + c.weight, 0);
  const got = checks.filter((c) => c.passed).reduce((s, c) => s + c.weight, 0);
  return { url: url.toString(), score: Math.round((got / total) * 100), checks };
}
