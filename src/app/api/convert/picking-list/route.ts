import { NextRequest, NextResponse } from 'next/server';
import { withQuota, bufferToBase64 } from '@/lib/api-helpers';
import { parsePackingList, buildPickingList } from '@/lib/excel/packing-list';
import { renderPickingListPdf } from '@/lib/pdf/picking-list';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  return withQuota(req, async () => {
    const formData = await req.formData();
    const file = formData.get('packingList') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'missing_file', message: 'Envie a planilha de lista de embalagem (.xlsx).' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const items = parsePackingList(buffer);
    const pickingList = buildPickingList(items);
    const pdf = await renderPickingListPdf(pickingList);

    return NextResponse.json({ pdfBase64: bufferToBase64(pdf), entryCount: pickingList.length });
  });
}
