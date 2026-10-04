export const APP_NAME = 'PrimeiraPágina';

export const hero = {
  title: 'Apareça na 1ª página do Google sem pagar ferramenta cara.',
  subtitle:
    'Dados reais do seu site, palavras-chave, concorrentes e uma nota de visibilidade nas IAs — tudo num painel só.',
  cta: 'Analisar meu site grátis',
};

export const problem = {
  title: 'Ferramentas de SEO custam mais do que um pequeno negócio consegue pagar',
  items: [
    { name: 'Semrush', price: 'US$140/mês' },
    { name: 'Concorrentes similares', price: 'US$129/mês' },
    { name: APP_NAME, price: 'Pague só o que usar' },
  ],
};

export const steps = [
  { title: 'Conecte seu Search Console', text: 'Acesso somente leitura aos dados reais do seu site.' },
  { title: 'Escolha concorrentes e palavras-chave', text: 'Veja sua posição ao lado da deles, termo a termo.' },
  { title: 'Receba sua nota GEO e o plano', text: 'Uma lista priorizada do que fazer primeiro.' },
];

export const benefits = [
  { icon: 'search', title: 'Descubra quem está quase na 1ª página', text: 'Consultas na página 2 do Google prontas para subir.' },
  { icon: 'users', title: 'Espie seus concorrentes', text: 'Posição deles versus a sua para cada palavra-chave.' },
  { icon: 'bot', title: 'Seja a resposta do ChatGPT', text: 'Nota GEO de 0 a 100 e o que corrigir para ser citado por IAs.' },
  { icon: 'wallet', title: 'Pague só o que usar', text: 'Sem mensalidade fixa de ferramenta.' },
] as const;

export const faq = [
  { q: 'O que é GEO?', a: 'Generative Engine Optimization: otimizar o site para ser citado por ChatGPT, Gemini, Perplexity e outras IAs.' },
  { q: 'Preciso saber SEO?', a: 'Não. O app explica cada item e diz o que fazer primeiro.' },
  { q: 'Meus dados do Google ficam seguros?', a: 'O acesso é somente leitura via OAuth e pode ser revogado a qualquer momento.' },
];

export const panelNav = [
  { href: '/painel', label: 'Visão geral' },
  { href: '/painel/gsc', label: 'Meu site no Google' },
  { href: '/painel/palavras', label: 'Palavras-chave' },
  { href: '/painel/geo', label: 'Nota GEO' },
  { href: '/painel/plano', label: 'Plano de ação' },
];
