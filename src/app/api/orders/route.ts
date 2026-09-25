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

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const orders = await Order.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar pedidos' },
      { status: 500 }
    );
  }
}

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
      customerWhatsApp: body.customerWhatsApp || '',
      paymentMethod: body.paymentMethod,
      buyTogether: body.buyTogether,
      total: body.total
    });
    
    // Buscar se o produto possui vendedor registrado para notificá-lo por email
    try {
      if (body.productId) {
        const Product = (await import('@/models/Product')).default;
        const User = (await import('@/models/User')).default;
        const { sendNewSaleSellerEmail, sendOrderConfirmationEmail } = await import('@/lib/email');

        const product = await Product.findById(body.productId);
        if (product && product.sellerId) {
          const seller = await User.findById(product.sellerId);
          if (seller && seller.email) {
            sendNewSaleSellerEmail(
              seller.email,
              seller.name || product.sellerBusiness || 'Vendedor',
              product.name,
              order._id.toString(),
              body.customerName,
              body.customerPhone,
              body.customerWhatsApp || '',
              body.total || product.price
            ).catch(() => {});
          }
        }

        // Email de confirmação para o cliente comprador
        if (body.customerEmail) {
          sendOrderConfirmationEmail(
            body.customerEmail,
            body.customerName,
            body.productName,
            order._id.toString(),
            body.total,
            body.paymentMethod
          ).catch(() => {});
        }
      }
    } catch (e) {
      console.error('[Order Notification Error]', e);
    }

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
