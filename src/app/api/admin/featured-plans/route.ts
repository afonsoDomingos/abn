import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import FeaturedPlan from '@/models/FeaturedPlan';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const plans = await FeaturedPlan.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching featured plans:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar planos de destaque' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const plan = await FeaturedPlan.create({
      name: body.name,
      description: body.description,
      duration: body.duration,
      price: body.price,
      position: body.position,
      applicableCategories: body.applicableCategories || [],
      isActive: body.isActive !== undefined ? body.isActive : true
    });
    
    return NextResponse.json({ 
      success: true, 
      plan 
    });
  } catch (error) {
    console.error('Error creating featured plan:', error);
    return NextResponse.json(
      { error: 'Erro ao criar plano de destaque' },
      { status: 500 }
    );
  }
}
