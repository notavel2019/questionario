import { NextRequest, NextResponse } from 'next/server';
import { withQuota, bufferToBase64 } from '@/lib/api-helpers';
import { convertMercadoLivrePdf } from '@/lib/pdf/ml';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return withQuota(req, async () => {
    const formData = await req.formData();
    const pdfFile = formData.get('pdfFile') as File | null;
    const numberLabels = formData.get('numberLabels') === 'true';

    if (!pdfFile) {
      return NextResponse.json(
        { error: 'missing_file', message: 'Envie o PDF de etiquetas baixado do painel do Mercado Livre.' },
        { status: 400 }
      );
    }

    const bytes = new Uint8Array(await pdfFile.arrayBuffer());
    const pdf = await convertMercadoLivrePdf(bytes, numberLabels);

    return NextResponse.json({ pdfBase64: bufferToBase64(pdf) });
  });
}
