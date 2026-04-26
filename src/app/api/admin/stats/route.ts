import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Business from '@/models/Business';
import Service from '@/models/Service';

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

    return NextResponse.json({
      stats: {
        totalUsers,
        totalStartups,
        activeServices,
        revenue: '0.00' // Placeholder for now
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
