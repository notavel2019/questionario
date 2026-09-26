import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { extractTextPerPage, extractTrackingCode } from './text-extract';

const PT_PER_INCH = 72;
const OUTPUT_WIDTH = 4.016 * PT_PER_INCH;
const OUTPUT_HEIGHT = 5.984 * PT_PER_INCH;

export type TiktokConversionResult = {
  pdf: Uint8Array;
  matchedCount: number;
  totalLabels: number;
  warning: string | null;
};

/**
 * Casa a etiqueta+packing slip do TikTok Shop com a NF-e correspondente pelo
 * código de rastreio (não pela ordem das páginas), e monta 1 pedido por
 * página 10x15cm.
 */
export async function convertTiktokShop(
  labelBytes: Uint8Array,
  nfeBytes: Uint8Array | null,
  numberLabels: boolean
): Promise<TiktokConversionResult> {
  const labelDoc = await PDFDocument.load(labelBytes);
  const labelPages = labelDoc.getPages();
  const totalLabels = labelPages.length;

  const outDoc = await PDFDocument.create();
  const font = await outDoc.embedFont(StandardFonts.Helvetica);

  let nfeTexts: string[] = [];
  let nfeDoc: PDFDocument | null = null;
  if (nfeBytes) {
    nfeDoc = await PDFDocument.load(nfeBytes);
    nfeTexts = await extractTextPerPage(nfeBytes);
  }

  const labelTexts = await extractTextPerPage(labelBytes);
  let matchedCount = 0;

  for (let i = 0; i < labelPages.length; i++) {
    const labelTracking = extractTrackingCode(labelTexts[i] ?? '');
    let nfePageIndex: number | null = null;

    if (labelTracking && nfeTexts.length > 0) {
      nfePageIndex = nfeTexts.findIndex((t) => extractTrackingCode(t) === labelTracking);
    }

    const { width, height } = labelPages[i].getSize();
    const hasNfe = nfePageIndex !== null && nfePageIndex >= 0 && nfeDoc;
    if (hasNfe) matchedCount++;

    const labelZoneFraction = hasNfe ? 0.78 : 1;
    const [embeddedLabel] = await outDoc.embedPages([labelPages[i]]);

    const outPage = outDoc.addPage([OUTPUT_WIDTH, OUTPUT_HEIGHT]);

    const labelZoneHeight = OUTPUT_HEIGHT * labelZoneFraction;
    const srcAspect = height / width;
    let drawWidth = OUTPUT_WIDTH - 8;
    let drawHeight = drawWidth * srcAspect;
    if (drawHeight > labelZoneHeight - 4) {
      drawHeight = labelZoneHeight - 4;
      drawWidth = drawHeight / srcAspect;
    }
    outPage.drawPage(embeddedLabel, {
      x: (OUTPUT_WIDTH - drawWidth) / 2,
      y: OUTPUT_HEIGHT - labelZoneHeight + (labelZoneHeight - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight,
    });

    if (hasNfe && nfeDoc) {
      const nfeSrcPage = nfeDoc.getPages()[nfePageIndex!];
      const nfeSize = nfeSrcPage.getSize();
      const [embeddedNfe] = await outDoc.embedPages([nfeSrcPage]);
      const nfeZoneHeight = OUTPUT_HEIGHT * (1 - labelZoneFraction);
      const nfeAspect = nfeSize.height / nfeSize.width;
      let nfeWidth = OUTPUT_WIDTH - 8;
      let nfeHeight = nfeWidth * nfeAspect;
      if (nfeHeight > nfeZoneHeight - 4) {
        nfeHeight = nfeZoneHeight - 4;
        nfeWidth = nfeHeight / nfeAspect;
      }
      outPage.drawPage(embeddedNfe, {
        x: (OUTPUT_WIDTH - nfeWidth) / 2,
        y: (nfeZoneHeight - nfeHeight) / 2,
        width: nfeWidth,
        height: nfeHeight,
      });
    }

    if (numberLabels) {
      outPage.drawText(`${i + 1}/${totalLabels}`, {
        x: OUTPUT_WIDTH - 36,
        y: OUTPUT_HEIGHT - 12,
        size: 7,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
    }
  }

  let warning: string | null = null;
  if (nfeBytes && matchedCount === 0) {
    warning =
      'Não conseguimos casar nenhuma NF-e com as etiquetas pelo código de rastreio. As etiquetas foram convertidas sem a NF-e.';
  } else if (nfeBytes && matchedCount < totalLabels) {
    warning = `${matchedCount} de ${totalLabels} etiquetas foram casadas com a NF-e correspondente. As demais foram convertidas sem NF-e.`;
  }

  return { pdf: await outDoc.save(), matchedCount, totalLabels, warning };
}
