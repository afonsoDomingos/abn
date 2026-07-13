import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import InvestmentProject from '@/models/InvestmentProject';
import Business from '@/models/Business';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    let projects = await InvestmentProject.find({}).populate({
      path: 'business',
      populate: { path: 'owner', select: 'name email' }
    });
    
    // Seed default investment projects if empty
    if (projects.length === 0) {
      projects = [
        {
          _id: 'proj1',
          business: {
            name: 'EcoSustento Bissau',
            category: 'Agricultura & Ecologia',
            description: 'Produção sustentável de fertilizantes biológicos a partir de resíduos de caju na Guiné-Bissau.',
            location: 'Bissau, Guiné-Bissau',
            website: 'https://ecosustento.gw',
            owner: { name: 'Mamadu Baldé', email: 'mamadu@ecosustento.gw' }
          },
          fundingGoal: '25.000 USD',
          equityOffered: 15,
          status: 'Aberto',
          createdAt: new Date()
        },
        {
          _id: 'proj2',
          business: {
            name: 'Bissau Pagamentos',
            category: 'Tecnologia & Fintech',
            description: 'Gateway de pagamentos integrados móveis para microempresas locais e vendedores informais.',
            location: 'Bissau, Guiné-Bissau',
            website: 'https://bissaupay.gw',
            owner: { name: 'Fatoumata Djaló', email: 'fatou@bissaupay.gw' }
          },
          fundingGoal: '50.000 USD',
          equityOffered: 20,
          status: 'Aberto',
          createdAt: new Date()
        }
      ] as any;
    }

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar projetos de investimento.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const { projectId, businessId, fundingGoal, equityOffered, pitchDeckUrl, financialsUrl, inquiryMessage } = await request.json();

    // Case 1: An investor is submitting an inquiry (Quero Investir)
    if (projectId && inquiryMessage) {
      const project = await InvestmentProject.findById(projectId);
      if (!project) {
        return NextResponse.json({ error: 'Projeto de investimento não encontrado.' }, { status: 404 });
      }

      project.inquiries.push({
        investor: session.id,
        message: inquiryMessage,
        createdAt: new Date()
      });

      await project.save();
      return NextResponse.json({ success: true, message: 'Interesse registado! O fundador do projeto foi notificado.' });
    }

    // Case 2: A founder is listing their business for investment
    if (businessId && fundingGoal && equityOffered) {
      // Verify owner
      const business = await Business.findById(businessId);
      if (!business) {
        return NextResponse.json({ error: 'Startup não encontrada.' }, { status: 404 });
      }

      if (String(business.owner) !== String(session.id) && session.role !== 'admin') {
        return NextResponse.json({ error: 'Acesso negado. Apenas o proprietário pode listar para investimento.' }, { status: 403 });
      }

      const project = await InvestmentProject.findOneAndUpdate(
        { business: businessId },
        { fundingGoal, equityOffered, pitchDeckUrl, financialsUrl, status: 'Aberto' },
        { new: true, upsert: true }
      );

      return NextResponse.json({ success: true, project });
    }

    return NextResponse.json({ error: 'Parâmetros inválidos.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
