import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// Listar todos os produtos submetidos por empreendedores
export async function GET() {
  try {
    await dbConnect();
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
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    // Buscar todas as empresas que têm produtos cadastrados para a loja
    const businesses = await Business.find({
      'productsAndServices.showInStore': true
    }).populate('owner', 'name email phone avatar');

    const submissions: any[] = [];

    businesses.forEach((biz: any) => {
      biz.productsAndServices.forEach((item: any) => {
        if (item.showInStore) {
          submissions.push({
            businessId: biz._id,
            businessName: biz.name,
            businessCategory: biz.category,
            ownerName: biz.owner?.name || 'Empreendedor',
            ownerEmail: biz.owner?.email || '',
            ownerPhone: biz.owner?.phone || '',
            itemId: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            type: item.type,
            image: item.image,
            active: item.active,
            storeApproval: item.storeApproval || 'pendente',
            approvalNotes: item.approvalNotes || ''
          });
        }
      });
    });

    return NextResponse.json({ success: true, submissions });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Aprovar ou Rejeitar produto
export async function PUT(request: Request) {
  try {
    await dbConnect();
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
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const { businessId, itemId, action, notes } = await request.json();

    if (!businessId || !itemId || !action) {
      return NextResponse.json({ error: 'Dados insuficientes.' }, { status: 400 });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return NextResponse.json({ error: 'Negócio não encontrado.' }, { status: 404 });
    }

    const item = business.productsAndServices.id(itemId);
    if (!item) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 });
    }

    if (action === 'aprovar') {
      item.storeApproval = 'aprovado';
      item.approvalNotes = notes || 'Aprovado para a Loja Oficial ABN';

      // Parsear preço numérico se possível
      const numMatch = (item.price || '').replace(/[^\d.]/g, '');
      const parsedPrice = numMatch ? parseFloat(numMatch) : 0;

      // Sincronizar na coleção Product para listagem oficial
      await Product.findOneAndUpdate(
        { sellerBusiness: business.name, name: item.name },
        {
          name: item.name,
          description: item.description,
          price: parsedPrice,
          category: business.category || 'Produtos',
          image: item.image || '',
          status: 'ativo',
          sellerId: business.owner,
          sellerName: business.name,
          sellerBusiness: business.name,
          approvalNotes: item.approvalNotes,
          reviewedAt: new Date()
        },
        { upsert: true, new: true }
      );
    } else if (action === 'rejeitar') {
      item.storeApproval = 'rejeitado';
      item.approvalNotes = notes || 'Não atende aos critérios da loja ABN no momento.';

      // Se existia na coleção de produtos públicos, desativar
      await Product.findOneAndUpdate(
        { sellerBusiness: business.name, name: item.name },
        { status: 'inativo', approvalNotes: item.approvalNotes }
      );
    }

    await business.save();

    return NextResponse.json({ success: true, message: `Produto ${action === 'aprovar' ? 'aprovado' : 'rejeitado'} com sucesso!` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
