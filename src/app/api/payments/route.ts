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

    const { itemName, price, proofUrl, phone, company } = await request.json();

    if (!itemName || !price || !proofUrl) {
      return NextResponse.json({ error: 'Ficheiro de comprovativo e detalhes do curso são obrigatórios.' }, { status: 400 });
    }

    // Check if enrollment already exists
    const existingPayment = await Payment.findOne({
      user: session.id,
      itemName: { $regex: new RegExp(`^${itemName.trim()}$`, 'i') },
      status: { $in: ['pendente', 'aprovado'] }
    });

    if (existingPayment) {
      return NextResponse.json({ error: 'Já se encontra inscrito ou a aguardar validação para este curso.' }, { status: 400 });
    }

    const payment = await Payment.create({
      user: session.id,
      itemName,
      price,
      proofUrl,
      phone: phone || '',
      company: company || '',
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

      // Send automatic email confirmation to student via Resend if approved
      if (status === 'aprovado') {
        try {
          const paymentWithUser = await Payment.findById(paymentId).populate('user', 'name email');
          if (paymentWithUser && paymentWithUser.user) {
            const userObj = paymentWithUser.user as any;
            const resendApiKey = process.env.RESEND_API_KEY;
            
            if (resendApiKey && userObj.email) {
              const fromEmail = process.env.RESEND_FROM_EMAIL || 'ABN - AfroBiz Network <onboarding@resend.dev>';
              const emailSubject = `Inscrição Confirmada: ${paymentWithUser.itemName}! 🎓`;
              const emailHtml = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 12px; color: #333;">
                  <h2 style="color: #ff6b00; text-align: center;">Inscrição Confirmada!</h2>
                  <p>Olá, <strong>${userObj.name}</strong>,</p>
                  <p>Temos o prazer de informar que a sua inscrição no curso <strong>${paymentWithUser.itemName}</strong> foi confirmada com sucesso!</p>
                  <p>O acesso a todo o conteúdo programático, incluindo a lista completa de aulas e vídeos estruturados, já se encontra totalmente disponível e desbloqueado na sua Dashboard.</p>
                  <div style="background: #fdf2e9; border-left: 4px solid #ff6b00; padding: 15px; margin: 20px 0; border-radius: 6px; font-size: 0.9rem;">
                    <strong>📚 Como aceder:</strong><br/>
                    1. Faça login na plataforma;<br/>
                    2. Vá para a secção <strong>Formação</strong> → <strong>Minhas Formações</strong>;<br/>
                    3. Clique em <strong>🎥 Assistir Aulas</strong> para iniciar a sua aprendizagem.
                  </div>
                  <p style="text-align: center; margin: 30px 0;">
                    <a href="https://afrobiznetwork.com/login" style="background: #ff6b00; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; display: inline-block;">Iniciar Aulas Agora</a>
                  </p>
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                  <p style="font-size: 0.8rem; color: #888; text-align: center;">AfroBiz Network Lda. — Moçambique. Todos os direitos reservados.</p>
                </div>
              `;

              fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${resendApiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  from: fromEmail,
                  to: userObj.email,
                  subject: emailSubject,
                  html: emailHtml
                })
              }).then(async (res) => {
                if (!res.ok) {
                  const errData = await res.json();
                  console.error('Failed to send enrollment email confirmation:', errData);
                }
              }).catch(err => {
                console.error('Network error sending enrollment email:', err);
              });
            }
          }
        } catch (mailErr) {
          console.error('Error during broadcast/confirmation email preparation:', mailErr);
        }
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
