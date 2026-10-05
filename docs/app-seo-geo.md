# App SEO + GEO — Conteúdo e especificação

> Base: Reel do Instagram DeB7semIHPM. Análise feita a partir dos frames e textos
> na tela (o áudio não foi transcrito). Revisar contra o vídeo antes de fechar o escopo.

## 1. O que o vídeo promete

"Você não precisa mais gastar dinheiro para aparecer na 1ª página do Google."
Alternativa às ferramentas pagas (Semrush ~US$140/mês, Ahrefs-like ~US$129/mês),
usando o Claude Code conectado a **3 ferramentas**:

| # | Ferramenta | Função | Custo |
|---|-----------|--------|-------|
| 1 | **Google Search Console (GSC MCP)** | Conecta o Claude aos dados reais do seu site: buscas no Google, posição média, páginas "quase na 1ª página" (posições 11–20, página 2) | Grátis |
| 2 | **OpenSEO** (open source, alternativa ao Semrush) | Pesquisa de palavras-chave na internet, sua posição e a dos concorrentes. Dados vêm da **DataForSEO** (paga só o que usar) | App grátis + uso da API |
| 3 | **GEO skill** | Auditoria de GEO (Generative Engine Optimization): torna o site citável como resposta no ChatGPT & cia. Comando `/geo audit seusite.com.br` → **nota GEO de 0 a 100** | Grátis |

Setup mostrado no vídeo: `claude mcp add` (GSC) → `/plugin install` (OpenSEO) → `install.sh` (GEO skill).

## 2. Conceito do app

Um painel web que entrega o mesmo resultado sem o usuário mexer em terminal:
o usuário conecta o site e recebe, em um só lugar, **o que fazer para subir no Google
e para ser citado por IAs**.

### Módulos (espelham as 3 ferramentas)

1. **Meu site no Google** (Search Console)
   - Login com Google + escolha da propriedade.
   - Tabela de consultas: cliques, impressões, CTR, posição.
   - Destaque "Quase lá": consultas nas posições 11–20 com maior potencial.
2. **Palavras-chave e concorrentes** (OpenSEO / DataForSEO)
   - Busca de palavra-chave: volume, dificuldade, CPC, tendência.
   - SERP: sua posição vs. concorrentes por termo.
   - Mostrador de custo de API usado no mês (pague só o que usar).
3. **Nota GEO** (GEO skill)
   - Entrada: URL. Saída: nota 0–100 + checklist priorizado
     (dados estruturados, respostas diretas, E-E-A-T, llms.txt, citabilidade, etc.).
4. **Plano de ação com IA** (Claude)
   - Cruza os 3 módulos e gera tarefas ordenadas por impacto/esforço.

## 3. Copy do site (landing)

**Hero**
- Título: *Apareça na 1ª página do Google sem pagar ferramenta cara.*
- Subtítulo: Dados reais do seu site, palavras-chave, concorrentes e uma nota de
  visibilidade nas IAs — tudo num painel só.
- CTA: **Analisar meu site grátis**

**Problema**: Semrush custa ~US$140/mês. Outras ~US$129/mês. Pequenos negócios ficam de fora.

**Como funciona (3 passos)**
1. Conecte seu Search Console.
2. Escolha seus concorrentes e palavras-chave.
3. Receba sua nota GEO e o plano de ação.

**Blocos de benefício**
- *Descubra quem está quase na 1ª página* — consultas na página 2 prontas para subir.
- *Espie seus concorrentes* — posição deles vs. a sua, termo a termo.
- *Seja a resposta do ChatGPT* — nota GEO de 0 a 100 e o que corrigir.
- *Pague só o que usar* — sem mensalidade fixa de ferramenta.

**FAQ**
- *O que é GEO?* Otimizar o site para ser citado por ChatGPT, Gemini, Perplexity etc.
- *Preciso saber SEO?* Não: o app explica cada item e diz o que fazer primeiro.
- *Meus dados do Google ficam seguros?* Acesso somente leitura via OAuth; revogável.

## 4. Arquitetura sugerida (aproveitando o repositório Next.js atual)

- **Front**: Next.js 14 + Tailwind + shadcn/ui (já presentes).
- **Auth/DB**: Firebase (já nas dependências) com login Google.
- **Search Console**: Google Search Console API (OAuth, escopo `webmasters.readonly`).
- **Keywords/SERP**: DataForSEO API (chave em variável de ambiente, cobrança por uso).
- **GEO**: rotina própria que baixa a URL e pontua critérios (schema.org, headings em
  formato de pergunta, resposta direta, `llms.txt`, robots para bots de IA, autoria,
  velocidade); nota 0–100 ponderada.
- **IA**: Claude API para o plano de ação (Server Actions, como já feito em `src/app/actions.ts`).
- Rotas: `/` landing · `/painel` · `/painel/gsc` · `/painel/palavras` · `/painel/geo` · `/painel/plano`.

## 5. Decisões em aberto

- Nome e marca do app (o repo hoje é o "Notável Briefing").
- Substituir o briefing atual ou manter como funcionalidade à parte.
- Modelo de cobrança: repasse do custo DataForSEO, créditos ou assinatura.
- Pesos exatos do cálculo da nota GEO.
