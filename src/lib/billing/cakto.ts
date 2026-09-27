/**
 * Integração com a Cakto (checkout hospedado + webhook), em vez do Mercado
 * Pago. Diferente do Mercado Pago (onde criávamos a cobrança via API), a
 * Cakto funciona com um link de checkout pronto: configure o produto/oferta
 * no painel da Cakto, copie o link e coloque em NEXT_PUBLIC_CAKTO_CHECKOUT_URL.
 *
 * Não tivemos acesso à documentação da Cakto neste ambiente (rede bloqueada
 * pra cakto.com.br). Confirme no painel deles: se dá pra pré-preencher
 * e-mail via query string, e o nome exato dos campos que o webhook envia
 * (ajuste `extractField` em api/billing/webhook/cakto/route.ts se precisar).
 */
export function getCaktoCheckoutUrl(): string | null {
  const base = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL;
  return base && base.trim() ? base.trim() : null;
}
