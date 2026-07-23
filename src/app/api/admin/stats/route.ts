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
      userGrowth
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
