import * as XLSX from 'xlsx';

export type PackingItem = {
  orderId: string;
  sku: string;
  variation: string;
  quantity: number;
};

export type PickingListEntry = {
  sku: string;
  variation: string;
  quantity: number;
};

const ORDER_COL_HINTS = ['pedido', 'order', 'nº do pedido', 'numero do pedido', 'n do pedido', 'id do pedido'];
const SKU_COL_HINTS = ['sku', 'código', 'codigo'];
const VARIATION_COL_HINTS = ['variação', 'variacao', 'variation', 'variante'];
const QTY_COL_HINTS = ['quantidade', 'qtd', 'quantity', 'qty'];

function normalizeHeader(h: string): string {
  return h
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function findColumn(headers: string[], hints: string[]): number {
  const normalized = headers.map(normalizeHeader);
  for (const hint of hints) {
    const idx = normalized.findIndex((h) => h.includes(normalizeHeader(hint)));
    if (idx !== -1) return idx;
  }
  return -1;
}

export function parsePackingList(buffer: Buffer | ArrayBuffer): PackingItem[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  if (rows.length === 0) return [];

  const headers = (rows[0] as unknown[]).map(String);
  const orderCol = findColumn(headers, ORDER_COL_HINTS);
  const skuCol = findColumn(headers, SKU_COL_HINTS);
  const variationCol = findColumn(headers, VARIATION_COL_HINTS);
  const qtyCol = findColumn(headers, QTY_COL_HINTS);

  if (orderCol === -1 || skuCol === -1) {
    throw new Error(
      'Não encontramos as colunas de pedido/SKU na planilha. Verifique se é a lista de embalagem exportada da Shopee.'
    );
  }

  const items: PackingItem[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as unknown[];
    if (!row || row.every((c) => c === '' || c == null)) continue;
    const orderId = String(row[orderCol] ?? '').trim();
    const sku = String(row[skuCol] ?? '').trim();
    if (!orderId || !sku) continue;
    const variation = variationCol !== -1 ? String(row[variationCol] ?? '').trim() : '';
    const qtyRaw = qtyCol !== -1 ? row[qtyCol] : 1;
    const quantity = Number(qtyRaw) || 1;
    items.push({ orderId, sku, variation, quantity });
  }

  return items;
}

export function buildOrderMap(items: PackingItem[]): Map<string, PackingItem[]> {
  const map = new Map<string, PackingItem[]>();
  for (const item of items) {
    const list = map.get(item.orderId) ?? [];
    list.push(item);
    map.set(item.orderId, list);
  }
  return map;
}

export function buildPickingList(items: PackingItem[]): PickingListEntry[] {
  const map = new Map<string, PickingListEntry>();
  for (const item of items) {
    const key = `${item.sku}::${item.variation}`;
    const existing = map.get(key);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      map.set(key, { sku: item.sku, variation: item.variation, quantity: item.quantity });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.sku.localeCompare(b.sku));
}
