import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bwipjs = require('bwip-js/node');
import type { ZplLabel } from './types';

const PT_PER_INCH = 72;

function dotsToPt(dots: number, dpi: number): number {
  return (dots / dpi) * PT_PER_INCH;
}

type BwipOptions = {
  bcid: string;
  text: string;
  scale?: number;
  height?: number;
  includetext?: boolean;
  textxalign?: string;
};

async function renderBarcodePng(data: string, kind: 'code128' | 'qrcode', heightPt: number): Promise<Buffer> {
  const options: BwipOptions =
    kind === 'qrcode'
      ? { bcid: 'qrcode', text: data || ' ', scale: 4, includetext: false }
      : {
          bcid: 'code128',
          text: data || ' ',
          scale: 3,
          height: Math.max(8, Math.round(heightPt / 3)),
          includetext: true,
          textxalign: 'center',
        };
  return bwipjs.toBuffer(options);
}

/** Desenha uma etiqueta ZPL já interpretada em uma nova página do PDF, com o tamanho físico informado (em polegadas). */
export async function drawZplLabel(
  doc: PDFDocument,
  label: ZplLabel,
  pageSizeIn: { width: number; height: number },
  font: PDFFont
): Promise<PDFPage> {
  const pageWidthPt = pageSizeIn.width * PT_PER_INCH;
  const pageHeightPt = pageSizeIn.height * PT_PER_INCH;
  const page = doc.addPage([pageWidthPt, pageHeightPt]);

  // Fator de escala entre os "dots" declarados na etiqueta e o tamanho físico de página desejado.
  const scaleX = pageWidthPt / dotsToPt(label.widthDots, label.dpi);
  const scaleY = pageHeightPt / dotsToPt(label.heightDots, label.dpi);

  const toPt = (dots: number) => dotsToPt(dots, label.dpi);

  for (const el of label.elements) {
    if (el.type === 'text') {
      const fontSize = Math.max(6, toPt(el.fontHeight) * scaleY * 0.75);
      const xPt = toPt(el.x) * scaleX;
      // ZPL usa y crescendo para baixo a partir do topo; pdf-lib usa origem embaixo à esquerda.
      const yTopPt = toPt(el.y) * scaleY;
      const yPt = pageHeightPt - yTopPt - fontSize;
      const lines = el.text.split('\n');
      lines.forEach((line, i) => {
        page.drawText(line, {
          x: xPt,
          y: yPt - i * fontSize * 1.15,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
      });
    } else if (el.type === 'box') {
      const xPt = toPt(el.x) * scaleX;
      const yTopPt = toPt(el.y) * scaleY;
      const wPt = toPt(el.width) * scaleX;
      const hPt = toPt(el.height) * scaleY;
      const yPt = pageHeightPt - yTopPt - hPt;
      page.drawRectangle({
        x: xPt,
        y: yPt,
        width: wPt,
        height: hPt,
        borderWidth: Math.max(0.5, toPt(el.thickness) * scaleY),
        borderColor: rgb(0, 0, 0),
        color: undefined,
      });
    } else if (el.type === 'barcode') {
      if (!el.data) continue;
      const heightPt = toPt(el.height) * scaleY;
      try {
        const png = await renderBarcodePng(el.data, el.kind, heightPt);
        const img = await doc.embedPng(png);
        const xPt = toPt(el.x) * scaleX;
        const yTopPt = toPt(el.y) * scaleY;
        const aspect = img.height / img.width;
        const targetHeight = el.kind === 'qrcode' ? Math.max(heightPt, 60) : heightPt;
        const targetWidth = el.kind === 'qrcode' ? targetHeight / aspect : targetHeight / aspect;
        const yPt = pageHeightPt - yTopPt - targetHeight;
        page.drawImage(img, { x: xPt, y: yPt, width: targetWidth, height: targetHeight });
      } catch {
        // Dados de código de barras inválidos/vazios — ignora silenciosamente este elemento.
      }
    }
  }

  return page;
}

export async function renderZplLabelsToPdf(
  labels: ZplLabel[],
  pageSizeIn: { width: number; height: number },
  pageNumbers?: boolean
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const total = labels.length;

  for (let i = 0; i < labels.length; i++) {
    const page = await drawZplLabel(doc, labels[i], pageSizeIn, font);
    if (pageNumbers) {
      const pageWidthPt = pageSizeIn.width * PT_PER_INCH;
      const pageHeightPt = pageSizeIn.height * PT_PER_INCH;
      const label = `${i + 1}/${total}`;
      page.drawText(label, {
        x: pageWidthPt - 40,
        y: pageHeightPt - 14,
        size: 8,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
    }
  }

  return doc.save();
}
