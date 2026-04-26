import { NextResponse } from 'next/server';
import { seedAdmin } from '@/lib/seed';

export async function GET() {
  try {
    await seedAdmin();
    return NextResponse.json({ success: true, message: 'Processo de seed concluído.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
