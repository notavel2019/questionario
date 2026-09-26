import { NextRequest, NextResponse } from 'next/server';
import { getUsageStatus } from '@/lib/usage';

export async function GET(req: NextRequest) {
  const status = await getUsageStatus(req);
  return NextResponse.json(status);
}
