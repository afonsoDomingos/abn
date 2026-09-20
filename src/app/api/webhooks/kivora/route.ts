import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { 
  sendOrderConfirmationEmail, 
  sendDigitalProductDownloadEmail,
  sendPaymentFailedEmail 
} from '@/lib/email';

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

// Validate webhook signature (if Kivora provides one)
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Log webhook event for debugging
    console.log('Kivora Webhook received:', body);
    
    // Extract payment data from webhook
    const { type, data } = body;
    
    if (!data || !data.reference) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }
    
    // Find order by reference (orderId)
    const order = await Order.findOne({ kivoraPaymentId: data.id }) || 
                   await Order.findById(data.reference);
    
    if (!order) {
      console.log('Order not found for webhook:', data.reference);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Update order based on payment status
    if (type === 'payment.completed' || data.status === 'paid') {
      order.status = 'paid';
      order.kivoraStatus = 'paid';
      order.kivoraPaymentId = data.id;
      order.updatedAt = new Date();
      await order.save();
      
      console.log('Order marked as paid:', order._id);
      
      // Send confirmation email
      await sendOrderConfirmationEmail(
        order.customerEmail,
        order.customerName,
        order._id.toString(),
        order.productName,
        order.total,
        order.paymentMethod
      );
      
      // TODO: If digital product, send download link
      // This would require fetching the product to get downloadUrl
      
      // TODO: Notify admin of new paid order
      
    } else if (type === 'payment.failed' || data.status === 'failed') {
      order.status = 'failed';
      order.kivoraStatus = 'failed';
      order.kivoraPaymentId = data.id;
      order.updatedAt = new Date();
      await order.save();
      
      console.log('Order marked as failed:', order._id);
      
      // Send payment failed email
      await sendPaymentFailedEmail(
        order.customerEmail,
        order.customerName,
        order.productName,
        order._id.toString(),
        order.total
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
