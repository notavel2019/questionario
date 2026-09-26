// @ts-ignore - build legacy do pdfjs não tem tipos completos para uso em Node
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

export async function extractTextPerPage(bytes: Uint8Array): Promise<string[]> {
  const loadingTask = pdfjsLib.getDocument({ data: bytes, useWorkerFetch: false, isEvalSupported: false });
  const pdf = await loadingTask.promise;
  const texts: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: unknown) => (item as { str?: string }).str ?? '').join(' ');
    texts.push(text);
  }

  return texts;
}

const TRACKING_REGEX = /\b([A-Z]{2}\d{9,12}[A-Z]{0,2}|\d{13,20})\b/;

export function extractTrackingCode(text: string): string | null {
  const match = text.match(TRACKING_REGEX);
  return match ? match[0] : null;
}
