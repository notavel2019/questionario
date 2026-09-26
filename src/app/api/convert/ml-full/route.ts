import { NextRequest, NextResponse } from 'next/server';
import { withQuota, bufferToBase64 } from '@/lib/api-helpers';
import { extractZplInput } from '@/lib/converters/extract-zpl-input';
import { convertMlFull } from '@/lib/converters/ml-full';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return withQuota(req, async () => {
    const formData = await req.formData();
    const zplFile = formData.get('zplFile') as File | null;
    const pastedZpl = formData.get('zplText') as string | null;
    const numberLabels = formData.get('numberLabels') === 'true';

    const zplText = await extractZplInput(zplFile, pastedZpl);
    const pdf = await convertMlFull(zplText, numberLabels);

    return NextResponse.json({ pdfBase64: bufferToBase64(pdf) });
  });
}
