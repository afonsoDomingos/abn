import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Business from '@/models/Business';
import Service from '@/models/Service';
import Payment from '@/models/Payment';
import Program from '@/models/Program';
import Event from '@/models/Event';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    // Real counts from MongoDB
    const totalUsers = await User.countDocuments();
    const totalStartups = await Business.countDocuments();
    const activeServices = await Service.countDocuments();
    
    // Programs, Events & News stats
    const totalPrograms = await Program.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalNews = await Post.countDocuments();

    // Total Enrollments & Pending Certificate Requests
    const totalEnrollments = await Payment.countDocuments();
    const pendingCertificates = await Payment.countDocuments({ certificateRequested: true, certificateApproved: false });

    // Real Distribution data by user role
    const empreendedores = await User.countDocuments({ role: 'empreendedor' });
    const startups = await User.countDocuments({ role: 'startup' });
    const investidores = await User.countDocuments({ role: 'investidor' });

    // Real Monthly User Growth (Last 5 Months)
    const now = new Date();
    const userGrowth = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await User.countDocuments({
        createdAt: { $gte: d, $lt: nextD }
      });
      const monthName = d.toLocaleDateString('pt-PT', { month: 'short' }).replace('.', '');
      const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      userGrowth.push({ month: formattedMonth, count });
    }

    // Calculate dynamic real revenue from approved course registrations/payments
    const approvedPayments = await Payment.find({ status: 'aprovado' });
    let totalRevenue = 0;

    for (const payment of approvedPayments) {
      if (payment.price && payment.price !== 'Gratuito') {
        const cleanPrice = payment.price.replace(/[^\d]/g, '');
        const val = parseInt(cleanPrice, 10);
        if (!isNaN(val)) {
          totalRevenue += val;
        }
      }
    }

    const formattedRevenue = totalRevenue.toLocaleString('pt-PT') + ' MT';

    // Fetch real activity log events (Enrollments, Certificate Requests, User Signups)
    const recentPayments = await Payment.find().sort({ createdAt: -1 }).limit(6).populate('user', 'name email');
    const recentUsersList = await User.find().sort({ createdAt: -1 }).limit(6);

    const activities: any[] = [];

    recentPayments.forEach((p: any) => {
      const userName = p.user?.name || p.user?.email || 'Aluno';
      if (p.certificateRequested) {
        activities.push({
          id: `cert-${p._id}`,
          icon: '📜',
          title: 'Solicitação de Certificado',
          desc: `${userName} solicitou emissão de certificado para o curso "${p.itemName}"`,
          createdAt: p.createdAt,
          type: 'certificate',
          badge: p.certificateApproved ? 'Aprovado' : 'Pendente'
        });
      }
      activities.push({
        id: `pay-${p._id}`,
        icon: '🎓',
        title: `Inscrição em Curso (${p.price})`,
        desc: `${userName} inscreveu-se no curso "${p.itemName}"`,
        createdAt: p.createdAt,
        type: 'enrollment',
        badge: p.status
      });
    });

    recentUsersList.forEach((u: any) => {
      activities.push({
        id: `user-${u._id}`,
        icon: '👤',
        title: 'Novo Membro Registado',
        desc: `${u.name || u.email} registou-se na plataforma como ${u.role || 'membro'}`,
        createdAt: u.createdAt,
        type: 'user',
        badge: 'Novo'
      });
    });

    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const recentActivities = activities.slice(0, 6);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalStartups,
        activeServices,
        totalPrograms,
        totalEvents,
        totalNews,
        totalEnrollments,
        pendingCertificates,
        revenue: formattedRevenue
      },
      distribution: {
        empreendedores,
        startups,
        investidores
      },
      userGrowth,
      recentActivities
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
