import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

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

    // Admins get all payment logs, users get only their own
    const filter = session.role === 'admin' ? {} : { user: session.id };
    const payments = await Payment.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, payments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const { itemName, price, proofUrl } = await request.json();

    if (!itemName || !price || !proofUrl) {
      return NextResponse.json({ error: 'Ficheiro de comprovativo e detalhes do curso são obrigatórios.' }, { status: 400 });
    }

    const payment = await Payment.create({
      user: session.id,
      itemName,
      price,
      proofUrl,
      status: 'pendente'
    });

    return NextResponse.json({ success: true, payment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

    const body = await request.json();
    const { paymentId, status, completed, certificateRequested } = body;

    if (!paymentId) {
      return NextResponse.json({ error: 'ID do pagamento é obrigatório.' }, { status: 400 });
    }

    if (status !== undefined) {
      if (session.role !== 'admin') {
        const checkPayment = await Payment.findById(paymentId);
        if (checkPayment && checkPayment.price === 'Gratuito' && checkPayment.user.toString() === session.id && status === 'aprovado') {
          // Allowed for free course auto-approval
        } else {
          return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
        }
      }
      const payment = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true });
      if (!payment) {
        return NextResponse.json({ error: 'Pagamento não encontrado.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, payment });
    }

    // Progress updates (completed, certificateRequested)
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ error: 'Pagamento não encontrado.' }, { status: 404 });
    }

    // Verify ownership or admin role
    if (payment.user.toString() !== session.id && session.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const updates: any = {};
    if (completed !== undefined) updates.completed = completed;
    if (certificateRequested !== undefined) updates.certificateRequested = certificateRequested;

    const updatedPayment = await Payment.findByIdAndUpdate(paymentId, updates, { new: true });
    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
