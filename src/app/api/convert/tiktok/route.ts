import { NextRequest, NextResponse } from 'next/server';
import { withQuota, bufferToBase64 } from '@/lib/api-helpers';
import { convertTiktokShop } from '@/lib/pdf/tiktok';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return withQuota(req, async () => {
    const formData = await req.formData();
    const labelFile = formData.get('labelFile') as File | null;
    const nfeFile = formData.get('nfeFile') as File | null;
    const numberLabels = formData.get('numberLabels') === 'true';

    if (!labelFile) {
      return NextResponse.json(
        {
          error: 'missing_file',
          message: 'Envie o PDF "Shipping label + Packing slip" exportado do Seller Center.',
        },
        { status: 400 }
      );
    }

    const labelBytes = new Uint8Array(await labelFile.arrayBuffer());
    const nfeBytes = nfeFile ? new Uint8Array(await nfeFile.arrayBuffer()) : null;

    const result = await convertTiktokShop(labelBytes, nfeBytes, numberLabels);

    return NextResponse.json({
      pdfBase64: bufferToBase64(result.pdf),
      warning: result.warning,
      matchedCount: result.matchedCount,
      totalLabels: result.totalLabels,
    });
  });
}
