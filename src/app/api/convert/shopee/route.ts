import { NextRequest, NextResponse } from 'next/server';
import { withQuota, bufferToBase64 } from '@/lib/api-helpers';
import { extractZplInput } from '@/lib/converters/extract-zpl-input';
import { convertShopee } from '@/lib/converters/shopee';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return withQuota(req, async () => {
    const formData = await req.formData();
    const zplFile = formData.get('zplFile') as File | null;
    const pastedZpl = formData.get('zplText') as string | null;
    const packingListFile = formData.get('packingList') as File | null;
    const numberLabels = formData.get('numberLabels') === 'true';

    const zplText = await extractZplInput(zplFile, pastedZpl);
    const packingListBuffer = packingListFile ? Buffer.from(await packingListFile.arrayBuffer()) : null;

    const result = await convertShopee(zplText, packingListBuffer, numberLabels);

    return NextResponse.json({
      labelPdfBase64: bufferToBase64(result.labelPdf),
      pickingListPdfBase64: result.pickingListPdf ? bufferToBase64(result.pickingListPdf) : null,
      warning: result.warning,
      labelCount: result.labelCount,
      matchedCount: result.matchedCount,
    });
  });
}
