import type { ZplLabel, ZplElement } from './types';

/**
 * Interpretador de um subconjunto de ZPL suficiente para etiquetas de
 * marketplace (Shopee, Mercado Livre Full): texto (^A/^FD), código de barras
 * Code128 (^BC) e QR (^BQ), caixas/linhas (^GB), e configuração de página
 * (^PW/^LL). Não é um interpretador ZPL completo — cobre os comandos
 * realmente emitidos por esses geradores de etiqueta.
 */

const DEFAULT_DPI = 203;

function splitLabels(zpl: string): string[] {
  const labels: string[] = [];
  const regex = /\^XA([\s\S]*?)\^XZ/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(zpl)) !== null) {
    labels.push(match[1]);
  }
  if (labels.length === 0 && zpl.trim().length > 0) {
    // Sem ^XA/^XZ — trata o conteúdo inteiro como uma única etiqueta.
    labels.push(zpl);
  }
  return labels;
}

function tokenize(body: string): string[] {
  // Cada comando começa com ^ ou ~. Mantém o caractere junto ao comando.
  return body.split(/(?=[\^~])/g).map((t) => t.trim()).filter(Boolean);
}

export function parseZpl(zpl: string, dpi: number = DEFAULT_DPI): ZplLabel[] {
  const labelBodies = splitLabels(zpl);

  return labelBodies.map((body) => {
    const tokens = tokenize(body);
    const elements: ZplElement[] = [];

    let widthDots = Math.round(4.02 * dpi);
    let heightDots = Math.round(5.98 * dpi);

    let x = 0;
    let y = 0;
    let fontHeight = 20;
    let fontWidth = 20;

    let barcodeModuleWidth = 2;
    let barcodeHeight = 60;
    let barcodeShowText = true;

    for (const raw of tokens) {
      const cmd2 = raw.slice(0, 3); // e.g. ^FO, ^FD, ^GB, ^BC, ^BQ, ^BY, ^PW, ^LL
      const cmdA = raw.slice(0, 2); // e.g. ^A

      if (raw.startsWith('^PW')) {
        const v = parseInt(raw.slice(3), 10);
        if (!isNaN(v) && v > 0) widthDots = v;
      } else if (raw.startsWith('^LL')) {
        const v = parseInt(raw.slice(3), 10);
        if (!isNaN(v) && v > 0) heightDots = v;
      } else if (cmd2 === '^FO') {
        const [xs, ys] = raw.slice(3).split(',');
        x = parseInt(xs, 10) || 0;
        y = parseInt(ys, 10) || 0;
      } else if (cmdA === '^A' && !raw.startsWith('^BQ')) {
        // ^Afo,height,width (f=fonte, o=orientação) — parâmetros numéricos vêm após a 1ª vírgula.
        const commaIdx = raw.indexOf(',');
        const params = commaIdx === -1 ? [] : raw.slice(commaIdx + 1).split(',');
        const h = parseInt(params[0], 10);
        const w = parseInt(params[1], 10);
        if (!isNaN(h)) fontHeight = h;
        fontWidth = !isNaN(w) ? w : h;
      } else if (raw.startsWith('^CF')) {
        // ^CFf,height,width (f=fonte) — idem, parâmetros numéricos após a 1ª vírgula.
        const commaIdx = raw.indexOf(',');
        const params = commaIdx === -1 ? [] : raw.slice(commaIdx + 1).split(',');
        const h = parseInt(params[0], 10);
        const w = parseInt(params[1], 10);
        if (!isNaN(h)) fontHeight = h;
        if (!isNaN(w)) fontWidth = w;
      } else if (raw.startsWith('^BY')) {
        const params = raw.slice(3).split(',');
        const w = parseInt(params[0], 10);
        if (!isNaN(w)) barcodeModuleWidth = w;
        const h = parseInt(params[2], 10);
        if (!isNaN(h)) barcodeHeight = h;
      } else if (raw.startsWith('^BC')) {
        const params = raw.slice(3).split(',');
        const h = parseInt(params[1], 10);
        if (!isNaN(h) && h > 0) barcodeHeight = h;
        const printText = params[2];
        barcodeShowText = printText !== 'N';
        // O ^FD seguinte contém os dados; guarda um marcador pendente.
        elements.push({
          type: 'barcode',
          kind: 'code128',
          x,
          y,
          data: '',
          height: barcodeHeight,
          moduleWidth: barcodeModuleWidth,
          showText: barcodeShowText,
        });
      } else if (raw.startsWith('^BQ')) {
        elements.push({
          type: 'barcode',
          kind: 'qrcode',
          x,
          y,
          data: '',
          height: barcodeModuleWidth * 20,
          moduleWidth: barcodeModuleWidth,
          showText: false,
        });
      } else if (raw.startsWith('^GB')) {
        const params = raw.slice(3).split(',');
        const w = parseInt(params[0], 10) || 0;
        const h = parseInt(params[1], 10) || 0;
        const thickness = parseInt(params[2], 10) || 1;
        elements.push({ type: 'box', x, y, width: w, height: h, thickness });
      } else if (raw.startsWith('^FD')) {
        const data = raw.slice(3).replace(/\\&/g, '\n');
        const last = elements[elements.length - 1];
        if (last && last.type === 'barcode' && last.data === '' && last.x === x && last.y === y) {
          last.data = data;
        } else {
          elements.push({
            type: 'text',
            x,
            y,
            text: data,
            fontHeight,
            fontWidth,
            reverse: false,
          });
        }
      } else if (raw.startsWith('^FB')) {
        const params = raw.slice(3).split(',');
        const width = parseInt(params[0], 10);
        const maxLines = parseInt(params[1], 10);
        const last = elements[elements.length - 1];
        if (last && last.type === 'text') {
          last.blockWidth = width;
          last.maxLines = isNaN(maxLines) ? undefined : maxLines;
        }
      }
      // Outros comandos (^FS, ^FR, ^CI, ^PQ, ^MM, ^FX comentários) são ignorados.
    }

    return { widthDots, heightDots, dpi, elements };
  });
}

/** Extrai um valor de texto pelo rótulo mais provável dentro do ZPL bruto (heurística por proximidade). */
export function guessOrderRefFromZpl(zpl: string): string | null {
  const trackingMatch = zpl.match(/\b([A-Z]{2}\d{9}[A-Z]{2}|\d{12,20})\b/);
  return trackingMatch ? trackingMatch[0] : null;
}
