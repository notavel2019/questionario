import { parseZpl, renderZplLabelsToPdf, LABEL_SIZE_10X15_IN } from '../zpl';
import type { ZplLabel } from '../zpl/types';
import { buildOrderMap, buildPickingList, parsePackingList, type PackingItem } from '../excel/packing-list';
import { renderPickingListPdf } from '../pdf/picking-list';

export type ShopeeConversionResult = {
  labelPdf: Uint8Array;
  pickingListPdf: Uint8Array | null;
  warning: string | null;
  labelCount: number;
  matchedCount: number;
};

function findOrderIdInLabel(label: ZplLabel, orderIds: string[]): string | null {
  const allText = label.elements
    .filter((e) => e.type === 'text')
    .map((e) => (e as { text: string }).text)
    .join(' ');
  const upperText = allText.toUpperCase();
  for (const orderId of orderIds) {
    if (orderId && upperText.includes(orderId.toUpperCase())) {
      return orderId;
    }
  }
  return null;
}

function appendOrderInfo(label: ZplLabel, items: PackingItem[]): void {
  const startY = label.heightDots - Math.round(0.55 * label.dpi);
  const lineHeight = Math.round(0.16 * label.dpi);
  const fontHeight = Math.round(0.11 * label.dpi);

  label.elements.push({
    type: 'box',
    x: 10,
    y: startY - 6,
    width: label.widthDots - 20,
    height: 1,
    thickness: 2,
  });

  items.slice(0, 6).forEach((item, i) => {
    const line = `${item.sku}${item.variation ? ' - ' + item.variation : ''}  x${item.quantity}`;
    label.elements.push({
      type: 'text',
      x: 10,
      y: startY + 4 + i * lineHeight,
      text: line,
      fontHeight,
      fontWidth: fontHeight,
      reverse: false,
    });
  });
}

export async function convertShopee(
  zplText: string,
  packingListBuffer: Buffer | null,
  numberLabels: boolean
): Promise<ShopeeConversionResult> {
  const labels = parseZpl(zplText);
  if (labels.length === 0) {
    throw new Error('Não encontramos etiquetas ZPL válidas no arquivo/texto enviado.');
  }

  let warning: string | null = null;
  let pickingListPdf: Uint8Array | null = null;
  let matchedCount = 0;

  if (packingListBuffer) {
    const items = parsePackingList(packingListBuffer);
    const orderMap = buildOrderMap(items);
    const orderIds = Array.from(orderMap.keys());

    for (const label of labels) {
      const matchedOrderId = findOrderIdInLabel(label, orderIds);
      if (matchedOrderId) {
        matchedCount++;
        appendOrderInfo(label, orderMap.get(matchedOrderId)!);
      }
    }

    if (matchedCount === 0) {
      warning =
        'A planilha enviada não bateu com nenhum pedido do lote de etiquetas. A conversão foi feita mesmo assim, sem os dados de SKU/variação impressos.';
    } else if (matchedCount < labels.length) {
      warning = `${matchedCount} de ${labels.length} etiquetas foram casadas com a planilha. As demais foram convertidas sem os dados de SKU/variação.`;
    }

    const pickingList = buildPickingList(items);
    pickingListPdf = await renderPickingListPdf(pickingList);
  }

  const labelPdf = await renderZplLabelsToPdf(labels, LABEL_SIZE_10X15_IN, numberLabels);

  return { labelPdf, pickingListPdf, warning, labelCount: labels.length, matchedCount };
}
