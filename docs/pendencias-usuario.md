# O que só você pode fazer

## 1. Conectar o Search Console (necessário para ver dados reais)
- [ ] No Google Cloud Console, criar (ou escolher) um projeto.
- [ ] Ativar a **Google Search Console API**.
- [ ] Configurar a tela de consentimento OAuth (tipo externo) e adicionar seu e-mail como **usuário de teste**.
- [ ] Criar um **ID de cliente OAuth** do tipo "Aplicativo da Web".
- [ ] Cadastrar o URI de redirecionamento: `{APP_URL}/api/auth/google/callback` (ex.: `http://localhost:9002/api/auth/google/callback`).
- [ ] Copiar `.env.example` para `.env.local` e preencher `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `SESSION_SECRET` (texto aleatório longo, ex.: `openssl rand -hex 32`) e `APP_URL`.
- [ ] Confirmar que o site está verificado como propriedade no Search Console com a mesma conta Google.
- [ ] Rodar `npm run dev`, abrir `/painel/gsc` e clicar em "Conectar Search Console". Me avisar se der erro.

## 2. Google Meu Negócio (avaliações e postagens reais)
- [ ] Confirmar que o Perfil da Empresa está verificado e que você é proprietário ou gerente.
- [ ] Solicitar acesso à API do Google Business Profile (formulário de solicitação do Google, a partir do mesmo projeto do Cloud). A análise pode levar dias.
- [ ] Depois da aprovação: ativar as APIs de Business Profile no projeto e me avisar. Eu adiciono o escopo `business.manage` e troco os dados fictícios pelos reais.

## 3. Palavras-chave e concorrentes reais
- [ ] Criar conta na DataForSEO e guardar login/senha da API (cobra por uso).
- [ ] Definir um teto de gasto mensal.
- [ ] Listar 3 a 5 concorrentes e as palavras-chave principais do seu negócio.

## 4. Plano de ação e respostas com IA
- [ ] Criar uma chave da API da Anthropic (console.anthropic.com).

## 5. Decisões
- [ ] Nome e marca definitivos do app (hoje: "PrimeiraPágina").
- [ ] Modelo de cobrança (repasse do custo, créditos ou assinatura).
- [ ] Manter o formulário de briefing em `/briefing` ou remover.
- [ ] Postagens do Google Meu Negócio: quer a tela de demonstração agora?
- [ ] Onde publicar o app (Firebase App Hosting já tem `apphosting.yaml`, ou outro).
