import { parseZpl, renderZplLabelsToPdf, LABEL_SIZE_FULL_ML_IN } from '../zpl';

export async function convertMlFull(zplText: string, numberLabels: boolean): Promise<Uint8Array> {
  const labels = parseZpl(zplText);
  if (labels.length === 0) {
    throw new Error('Não encontramos etiquetas ZPL válidas no texto enviado.');
  }
  return renderZplLabelsToPdf(labels, LABEL_SIZE_FULL_ML_IN, numberLabels);
}
