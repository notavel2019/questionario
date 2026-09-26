# **App Name**: Conversor de Etiquetas — Notável

Clone funcional do EtiqJá: converte etiquetas de marketplace (Shopee, Mercado
Livre, TikTok Shop) para PDF pronto pra impressora térmica 10×15cm.

## Core Features

- **Shopee**: ZPL (.zip/.txt ou colado) → PDF 10×15cm, com SKU/variação/quantidade
  impressos quando há planilha de lista de embalagem, e lista de separação
  (picking list) agrupada por SKU.
- **Mercado Livre**: PDF A4 de 3 colunas (lista + etiqueta + DANFE) → 1 pedido
  por página 10×15cm.
- **Full ML**: ZPL da etiqueta pequena (8×2,5cm) → PDF alinhado para
  impressora de etiqueta dedicada.
- **TikTok Shop**: casa a NF-e com a etiqueta certa pelo código de rastreio
  (não pela ordem do arquivo) e monta 1 pedido por página.
- **Lista de separação**: gera picking list a partir de uma planilha avulsa.
- Numeração opcional do lote (`N/Total`), sem numerar a NF.
- Freemium: 3 conversões grátis/dia por usuário (contador Firestore,
  reseta à meia-noite America/Sao_Paulo), plano ilimitado via PIX.

## Style Guidelines

Reaproveita o design system já usado nos produtos Notável (este mesmo
repositório): tipografia Inter, cor primária azul `hsl(221 83% 53%)`, acento
roxo `hsl(256 65% 61%)`, cantos arredondados (`radius: 0.8rem`), componentes
shadcn/ui, cabeçalho escuro com a logo Notável. Mesma paleta usada em
bio.notavel.com.br.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
- `pdf-lib` (composição/recorte de PDF), `pdfjs-dist` (extração de texto para
  casar rastreio), `bwip-js` (geração de código de barras/QR), `xlsx`
  (planilha de embalagem), `jszip` (extrair .txt do .zip da Shopee)
- Firebase Auth + Firestore (contador de uso e plano) + Firebase App Hosting
- Mercado Pago (PIX) para cobrança do plano ilimitado
