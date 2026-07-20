import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
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

    let session;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ success: false, error: 'Sessão inválida' }, { status: 401 });
    }

    const user = await User.findById(session.id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 });
    }

    if (user.role === 'investidor' || user.role === 'mentor') {
      // Retornar estatísticas do mentor/investidor
      return NextResponse.json({ 
        success: true, 
        stats: user.stats || {
          mentorshipHours: 0,
          averageRating: 0,
          startupsFollowing: 0,
          nextSession: null
        }
      });
    }

    // Caso seja empreendedor/startup
    let business = await Business.findOne({ owner: session.id });
    if (!business) {
       // Se não tem business, retornamos zero.
       return NextResponse.json({ 
         success: true, 
         stats: {
           profileViews: 0,
           projectViews: 0,
           interestedCount: 0,
           pitchDownloads: 0,
           messagesCount: 0
         },
         monthlyGrowth: [
          { month: 'Jan', views: 0, percentage: '0%', height: '5%' },
          { month: 'Fev', views: 0, percentage: '0%', height: '5%' },
          { month: 'Mar', views: 0, percentage: '0%', height: '5%' },
          { month: 'Abr', views: 0, percentage: '0%', height: '5%' },
          { month: 'Mai', views: 0, percentage: '0%', height: '5%' }
         ]
       });
    }

    // Se o business existe mas as stats estão vazias, preenchemos com 0.
    const stats = business.stats || {};
    const monthlyGrowth = business.monthlyGrowth && business.monthlyGrowth.length > 0 
      ? business.monthlyGrowth 
      : [
          { month: 'Jan', views: 0, percentage: '0%', height: '5%' },
          { month: 'Fev', views: 0, percentage: '0%', height: '5%' },
          { month: 'Mar', views: 0, percentage: '0%', height: '5%' },
          { month: 'Abr', views: 0, percentage: '0%', height: '5%' },
          { month: 'Mai', views: 0, percentage: '0%', height: '5%' }
        ];

    return NextResponse.json({ 
      success: true, 
      stats: {
        profileViews: stats.profileViews || 0,
        projectViews: stats.projectViews || 0,
        interestedCount: stats.interestedCount || 0,
        pitchDownloads: stats.pitchDownloads || 0,
        messagesCount: stats.messagesCount || 0
      },
      monthlyGrowth
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar analíticas do usuário.' }, { status: 500 });
  }
}
