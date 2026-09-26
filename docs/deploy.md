# Deploy e custo — Firebase App Hosting

## Por que Firebase App Hosting (e não Railway)

A spec original sugeria Railway pra rodar as libs de PDF sem limite de tempo
de execução serverless. Na prática, cada conversão aqui roda **em memória**,
dentro de uma única request HTTP (o `pdf-lib`/`pdfjs-dist`/`bwip-js` processam
o PDF e devolvem o resultado direto na resposta, sem fila nem worker
persistente) — não há necessidade de um servidor sempre ligado. Isso cabe
perfeitamente no Firebase App Hosting (que já é o hosting configurado neste
repo via `apphosting.yaml`) e mantém o custo dentro do orçamento pedido
(R$ 15/mês ou R$ 97/ano).

Se o volume crescer muito (milhares de conversões simultâneas, arquivos
gigantes), aí sim vale migrar o processamento pesado para uma fila
(BullMQ/Redis) num serviço à parte — mas isso sai do orçamento de
R$15-97/mês e não é necessário pro lançamento.

## O que o Firebase App Hosting cobra

App Hosting roda sobre **Cloud Run** (plano Blaze, pay-as-you-go):

| Recurso | Franquia grátis/mês | Uso estimado (MVP, algumas centenas de conversões/dia) |
|---|---|---|
| Cloud Run — requisições | 2 milhões | Bem abaixo |
| Cloud Run — vCPU-segundos | 180.000 | Cada conversão leva ~1-3s de CPU |
| Cloud Run — memória (GB-s) | 360.000 | Idem |
| Cloud Build (deploys) | 120 min/dia | Só consome no deploy, não no uso |
| Firestore — leituras/escritas | 50k/20k por dia | 1 leitura + 1 escrita por conversão (contador) |
| Egress de rede | 1 GB/mês (América do Norte) | PDFs gerados são pequenos (centenas de KB) |

Com `maxInstances: 1` (já configurado em `apphosting.yaml`) e
`minInstances: 0` (padrão — escala a zero quando ninguém usa), o app **não
cobra nada parado**. O gasto real só aparece se o uso ultrapassar a franquia
grátis, o que exigiria um volume bem maior que "algumas centenas de
conversões por dia".

**Estimativa prática:** para um lançamento com até ~5.000 conversões/mês, o
custo de infraestrutura fica entre **R$ 0 e R$ 15/mês** — dentro do
orçamento. Para manter isso, evite:
- Subir `maxInstances` além de 2-3 sem necessidade.
- Guardar arquivos no Cloud Storage (o MVP não guarda nada — os PDFs de
  entrada são processados em memória e descartados assim que a resposta é
  enviada; nem precisa de política de TTL de 24h porque nada fica salvo).
- Rodar o parsing de texto de PDF (`pdfjs-dist`) em arquivos gigantescos —
  o limite de 50MB por upload (já indicado na UI) protege disso.

## Passo a passo do deploy

1. Criar o projeto no [console do Firebase](https://console.firebase.google.com/)
   e ativar o plano **Blaze** (obrigatório pro App Hosting rodar Next.js SSR).
2. Ativar **Authentication** (e-mail/senha, e opcionalmente login social) e
   **Firestore** (modo produção).
3. Publicar as regras do Firestore: `firebase deploy --only firestore:rules`.
4. Copiar `.env.example` para `.env.local` e preencher:
   - As chaves `NEXT_PUBLIC_FIREBASE_*` (Configurações do projeto > Geral > apps web).
   - `FIREBASE_SERVICE_ACCOUNT_KEY` (Configurações do projeto > Contas de serviço).
   - `MERCADOPAGO_ACCESS_TOKEN` quando for ligar a cobrança PIX de verdade.
5. No console do Firebase, criar o backend de **App Hosting** apontando pro
   repositório Git (branch de produção) — o próprio `apphosting.yaml` já
   define `maxInstances: 1`.
6. Configurar as mesmas variáveis de ambiente do passo 4 como *secrets* do
   App Hosting (`firebase apphosting:secrets:set NOME_DA_VARIAVEL`).
7. Cada push na branch configurada dispara um novo build/deploy automático.

## Limite de uso e cobrança dentro do próprio produto

O contador de 3 conversões grátis/dia (`src/lib/usage.ts`) já está pronto e
usa Firestore com transação atômica — funciona em produção assim que
`FIREBASE_SERVICE_ACCOUNT_KEY` estiver configurada. Sem essa variável (ex.
ambiente de desenvolvimento local), o limite fica desativado de propósito,
pra não travar quem está codando.

A cobrança PIX (`src/app/api/billing/pix/route.ts`) usa a API do Mercado
Pago. Sem `MERCADOPAGO_ACCESS_TOKEN`, o endpoint responde 501 avisando que
a cobrança ainda não foi ligada — isso é intencional: o checkout completo
(confirmação de pagamento via webhook, liberação do plano no Firestore)
precisa das credenciais reais da conta Mercado Pago da Notável antes de ir
pra produção.
