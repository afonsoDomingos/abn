import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Config from '@/models/Config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const configs = await Config.find({});
    // Transform array to object for easier use
    const configMap = configs.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, any>);
    
    return NextResponse.json({ success: true, configs: configMap });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar configurações.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { key, value } = await request.json();
    
    if (!key) {
      return NextResponse.json({ error: 'Chave é obrigatória.' }, { status: 400 });
    }

    const config = await Config.findOneAndUpdate(
      { key },
      { value, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao salvar configuração.' }, { status: 500 });
  }
}
