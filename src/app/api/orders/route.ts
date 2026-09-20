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
  paymentMethod: String,
  buyTogether: Boolean,
  total: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const order = await Order.create({
      productId: body.productId,
      productName: body.productName,
      productPrice: body.productPrice,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      paymentMethod: body.paymentMethod,
      buyTogether: body.buyTogether,
      total: body.total
    });
    
    return NextResponse.json({ 
      success: true, 
      orderId: order._id 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Erro ao criar pedido' },
      { status: 500 }
    );
  }
}
