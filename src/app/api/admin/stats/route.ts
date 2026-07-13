import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Business from '@/models/Business';
import Service from '@/models/Service';
import Payment from '@/models/Payment';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    
    const totalUsers = await User.countDocuments();
    const totalStartups = await Business.countDocuments();
    const activeServices = await Service.countDocuments({ status: 'ativo' });
    
    // Distribution data for chart
    const empreendedores = await User.countDocuments({ role: 'empreendedor' });
    const startups = await User.countDocuments({ role: 'startup' });
    const investidores = await User.countDocuments({ role: 'investidor' });

    // Calculate dynamic revenue from approved course registrations/payments
    const approvedPayments = await Payment.find({ status: 'aprovado' });
    let totalRevenue = 0;

    for (const payment of approvedPayments) {
      if (payment.price && payment.price !== 'Gratuito') {
        // Remove non-digit characters to parse numeric amount
        const cleanPrice = payment.price.replace(/[^\d]/g, '');
        const val = parseInt(cleanPrice, 10);
        if (!isNaN(val)) {
          totalRevenue += val;
        }
      }
    }

    const formattedRevenue = totalRevenue.toLocaleString('pt-PT') + ' MT';

    return NextResponse.json({
      stats: {
        totalUsers,
        totalStartups,
        activeServices,
        revenue: formattedRevenue
      },
      distribution: {
        empreendedores,
        startups,
        investidores
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
