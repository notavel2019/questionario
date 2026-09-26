import JSZip from 'jszip';

/** Recebe um File de formData (.txt, .zip) e/ou texto colado, e retorna o ZPL bruto concatenado. */
export async function extractZplInput(file: File | null, pastedText: string | null): Promise<string> {
  const parts: string[] = [];

  if (pastedText && pastedText.trim()) {
    parts.push(pastedText.trim());
  }

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name.toLowerCase();

    if (name.endsWith('.zip')) {
      const zip = await JSZip.loadAsync(buffer);
      const txtFiles = Object.values(zip.files).filter(
        (f) => !f.dir && f.name.toLowerCase().endsWith('.txt')
      );
      for (const f of txtFiles) {
        parts.push(await f.async('text'));
      }
    } else {
      parts.push(buffer.toString('utf-8'));
    }
  }

  const combined = parts.join('\n');
  if (!combined.trim()) {
    throw new Error('Envie um arquivo .txt/.zip com o ZPL ou cole o código ZPL no campo de texto.');
  }
  return combined;
}
