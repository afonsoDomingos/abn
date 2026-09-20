import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  productPrice: Number,
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerWhatsApp: String,
  paymentMethod: String,
  buyTogether: Boolean,
  total: Number,
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed', 'cancelled'] },
  kivoraPaymentId: String,
  kivoraStatus: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const order = await Order.findById(id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedido' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    
    const order = await Order.findByIdAndUpdate(
      id,
      { 
        ...body,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar pedido' },
      { status: 500 }
    );
  }
}
