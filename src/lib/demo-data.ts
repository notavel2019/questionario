// Dados de demonstração. Substituir pelas integrações reais
// (Google Search Console API e DataForSEO) quando houver credenciais.
export type QueryRow = { query: string; clicks: number; impressions: number; ctr: number; position: number };

export const gscQueries: QueryRow[] = [
  { query: 'agência de marketing digital', clicks: 120, impressions: 4300, ctr: 2.8, position: 8.4 },
  { query: 'criação de sites profissionais', clicks: 64, impressions: 3100, ctr: 2.1, position: 12.3 },
  { query: 'quanto custa um site', clicks: 18, impressions: 5200, ctr: 0.3, position: 14.7 },
  { query: 'gestão de tráfego pago', clicks: 9, impressions: 2800, ctr: 0.3, position: 17.2 },
  { query: 'loja virtual para pequenas empresas', clicks: 41, impressions: 1900, ctr: 2.2, position: 6.1 },
  { query: 'seo para iniciantes', clicks: 5, impressions: 2400, ctr: 0.2, position: 19.5 },
];

export type KeywordRow = {
  keyword: string; volume: number; difficulty: number; cpc: number;
  you: number | null; competitor: { name: string; position: number };
};

export const keywords: KeywordRow[] = [
  { keyword: 'criação de sites', volume: 14800, difficulty: 62, cpc: 4.2, you: 12, competitor: { name: 'concorrente-a.com.br', position: 3 } },
  { keyword: 'agência de marketing digital', volume: 9900, difficulty: 71, cpc: 6.8, you: 8, competitor: { name: 'concorrente-b.com.br', position: 2 } },
  { keyword: 'quanto custa um site', volume: 5400, difficulty: 38, cpc: 2.1, you: 15, competitor: { name: 'concorrente-a.com.br', position: 4 } },
  { keyword: 'gestão de tráfego pago', volume: 3600, difficulty: 45, cpc: 5.3, you: 17, competitor: { name: 'concorrente-c.com.br', position: 6 } },
  { keyword: 'seo para iniciantes', volume: 2900, difficulty: 29, cpc: 1.4, you: null, competitor: { name: 'concorrente-b.com.br', position: 5 } },
];

export const apiUsage = { spent: 3.42, budget: 20 };

export type Review = {
  id: string; author: string; stars: 1 | 2 | 3 | 4 | 5; text: string; date: string; reply?: string;
};

// Demonstração. Substituir pela API do Google Business Profile após aprovação de acesso.
export const reviews: Review[] = [
  { id: 'r1', author: 'Mariana Costa', stars: 5, text: 'Atendimento excelente, o site ficou lindo e entregaram antes do prazo!', date: '2026-09-28' },
  { id: 'r2', author: 'João Pereira', stars: 2, text: 'O resultado ficou bom, mas demoraram muito para responder minhas mensagens.', date: '2026-09-25' },
  { id: 'r3', author: 'Ana Souza', stars: 4, text: 'Gostei do trabalho. Só achei o preço um pouco alto.', date: '2026-09-20', reply: 'Obrigado, Ana! Ficamos felizes com o seu retorno.' },
  { id: 'r4', author: 'Carlos Lima', stars: 1, text: 'Não fiquei satisfeito com a comunicação durante o projeto.', date: '2026-09-12' },
  { id: 'r5', author: 'Beatriz Alves', stars: 5, text: 'Subimos na busca do Google em poucas semanas. Recomendo!', date: '2026-09-05', reply: 'Que alegria, Beatriz! Obrigado pela confiança.' },
];
