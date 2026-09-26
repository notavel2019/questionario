import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { PickingListEntry } from '../excel/packing-list';

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 40;
const ROW_HEIGHT = 20;

export async function renderPickingListPdf(entries: PickingListEntry[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const drawHeader = () => {
    page.drawText('Lista de separação (picking list)', {
      x: MARGIN,
      y,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    y -= 28;
    page.drawText('SKU', { x: MARGIN, y, size: 10, font: boldFont });
    page.drawText('Variação', { x: MARGIN + 180, y, size: 10, font: boldFont });
    page.drawText('Quantidade', { x: PAGE_WIDTH - MARGIN - 80, y, size: 10, font: boldFont });
    y -= 10;
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 1,
      color: rgb(0.6, 0.6, 0.6),
    });
    y -= 16;
  };

  drawHeader();

  let totalQty = 0;
  for (const entry of entries) {
    if (y < MARGIN + ROW_HEIGHT) {
      page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;
      drawHeader();
    }
    page.drawText(entry.sku, { x: MARGIN, y, size: 10, font });
    page.drawText(entry.variation || '-', { x: MARGIN + 180, y, size: 10, font });
    page.drawText(String(entry.quantity), { x: PAGE_WIDTH - MARGIN - 80, y, size: 10, font });
    totalQty += entry.quantity;
    y -= ROW_HEIGHT;
  }

  y -= 10;
  page.drawLine({
    start: { x: MARGIN, y: y + 6 },
    end: { x: PAGE_WIDTH - MARGIN, y: y + 6 },
    thickness: 1,
    color: rgb(0.6, 0.6, 0.6),
  });
  page.drawText(`Total de itens: ${totalQty}`, { x: MARGIN, y: y - 8, size: 11, font: boldFont });

  return doc.save();
}
