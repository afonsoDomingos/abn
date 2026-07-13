import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import FreelancerProfile from '@/models/FreelancerProfile';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    let freelancers = await FreelancerProfile.find({}).populate('user', 'name email profileImage');
    
    // Seed default freelancer profiles if empty
    if (freelancers.length === 0) {
      freelancers = [
        {
          _id: 'free1',
          user: { name: 'Afonso Domingos', email: 'afonso@design.com', profileImage: '/Perfil01.jpg' },
          category: 'Design',
          skills: ['Figma', 'UI/UX Design', 'Branding', 'Adobe Illustrator'],
          pricePerHour: '25 USD / hora',
          rating: 4.9,
          portfolio: [{ title: 'Branding ABN Platform', description: 'Redesenho completo da identidade visual da AfroBiz Network.' }]
        },
        {
          _id: 'free2',
          user: { name: 'Moisés Nhantumbo', email: 'moises@tech.com', profileImage: '/Perfil04.jpg' },
          category: 'Tecnologia',
          skills: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Python'],
          pricePerHour: '35 USD / hora',
          rating: 5.0,
          portfolio: [{ title: 'Fintech Mobile App', description: 'Desenvolvimento de uma aplicação móvel para carteiras digitais.' }]
        },
        {
          _id: 'free3',
          user: { name: 'Hawa Touré', email: 'hawa@legal.com', profileImage: '/Perfil06.jpg' },
          category: 'Jurídico',
          skills: ['Direito Comercial', 'Contratos de Investimento', 'Propriedade Intelectual'],
          pricePerHour: '50 USD / hora',
          rating: 4.8,
          portfolio: [{ title: 'Termos e Condições Globais', description: 'Consultoria e elaboração de documentação de termos de serviço para scale-ups.' }]
        },
        {
          _id: 'free4',
          user: { name: 'Saliou Diop', email: 'saliou@acc.com', profileImage: '/default-avatar.png' },
          category: 'Contabilidade',
          skills: ['Planeamento de Impostos', 'Auditoria Financeira', 'Livro de Contas Excel'],
          pricePerHour: '20 USD / hora',
          rating: 4.7,
          portfolio: [{ title: 'Auditoria ABN Hub Senegal', description: 'Análise detalhada de contas e compliance para a delegação de Dakar.' }]
        }
      ] as any;
    }

    return NextResponse.json({ success: true, freelancers });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar prestadores de serviço.' }, { status: 500 });
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

    const { category, skills, pricePerHour, portfolio } = await request.json();

    if (!category) {
      return NextResponse.json({ error: 'Categoria é obrigatória.' }, { status: 400 });
    }

    const profile = await FreelancerProfile.findOneAndUpdate(
      { user: session.id },
      { category, skills, pricePerHour, portfolio },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, profile }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
