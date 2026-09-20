import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Admin authentication check
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ success: false, error: 'Sessão inválida' }, { status: 401 });
    }

    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado. Apenas administradores podem criar produtos.' }, { status: 403 });
    }

    await dbConnect();
    
    const productData = {
      name: 'Guia Completo de Social Media para Empreendedores',
      description: 'Este guia completo ensina como usar as redes sociais para crescer o seu negócio. Inclui estratégias para Instagram, Facebook, LinkedIn e TikTok, com exemplos práticos e templates prontos a usar. Ideal para empreendedores que querem aumentar a sua presença online e atrair mais clientes.',
      price: 1500,
      category: 'Marketing Digital',
      image: '',
      status: 'ativo',
      stock: 0, // 0 para ilimitado (produto digital)
      digital: true,
      downloadUrl: 'https://example.com/guia-social-media.pdf',
      order: 1,
      productType: 'digital',
      fileType: 'pdf',
      fileSize: '15MB',
      duration: '',
      previewUrl: ''
    };

    const product = await Product.findOneAndUpdate(
      { name: productData.name },
      productData,
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Produto de social media criado/atualizado com sucesso',
      product 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}