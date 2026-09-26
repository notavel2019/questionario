import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const PT_PER_INCH = 72;
const OUTPUT_WIDTH = 4.016 * PT_PER_INCH;
const OUTPUT_HEIGHT = 5.984 * PT_PER_INCH;

/**
 * Recorta as 3 colunas (lista de empacotamento | etiqueta de envio | NF/DANFE)
 * de cada página A4 do PDF do painel do Mercado Livre e remonta em 1 página
 * 10x15cm por pedido, empilhando: lista (topo) + etiqueta (centro, maior) +
 * DANFE simplificada (rodapé).
 */
export async function convertMercadoLivrePdf(
  sourceBytes: Uint8Array,
  numberLabels: boolean
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(sourceBytes);
  const outDoc = await PDFDocument.create();
  const font = await outDoc.embedFont(StandardFonts.Helvetica);

  const srcPages = srcDoc.getPages();
  if (srcPages.length === 0) {
    throw new Error('O PDF enviado não tem páginas.');
  }

  const total = srcPages.length;

  for (let i = 0; i < srcPages.length; i++) {
    const srcPage = srcPages[i];
    const { width, height } = srcPage.getSize();
    const colWidth = width / 3;

    const columns = [
      { left: 0, right: colWidth }, // lista de empacotamento
      { left: colWidth, right: colWidth * 2 }, // etiqueta de envio
      { left: colWidth * 2, right: width }, // NF/DANFE
    ];

    const embedded = await Promise.all(
      columns.map((c) =>
        outDoc.embedPage(srcPage, { left: c.left, bottom: 0, right: c.right, top: height })
      )
    );

    const outPage = outDoc.addPage([OUTPUT_WIDTH, OUTPUT_HEIGHT]);

    const zones = [
      { heightFraction: 0.18 }, // lista de empacotamento
      { heightFraction: 0.62 }, // etiqueta de envio (protagonista)
      { heightFraction: 0.2 }, // DANFE simplificada
    ];

    let cursorYTop = OUTPUT_HEIGHT;
    for (let z = 0; z < zones.length; z++) {
      const zoneHeight = OUTPUT_HEIGHT * zones[z].heightFraction;
      const emb = embedded[z];
      const srcAspect = emb.height / emb.width;
      let drawWidth = OUTPUT_WIDTH - 8;
      let drawHeight = drawWidth * srcAspect;
      if (drawHeight > zoneHeight - 4) {
        drawHeight = zoneHeight - 4;
        drawWidth = drawHeight / srcAspect;
      }
      const x = (OUTPUT_WIDTH - drawWidth) / 2;
      const y = cursorYTop - zoneHeight + (zoneHeight - drawHeight) / 2;
      outPage.drawPage(emb, { x, y, width: drawWidth, height: drawHeight });
      cursorYTop -= zoneHeight;
    }

    if (numberLabels) {
      outPage.drawText(`${i + 1}/${total}`, {
        x: OUTPUT_WIDTH - 36,
        y: OUTPUT_HEIGHT - 12,
        size: 7,
        font,
        color: rgb(0.3, 0.3, 0.3),
      });
    }
  }

  return outDoc.save();
}
