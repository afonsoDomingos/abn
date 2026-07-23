import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isPriceFree(priceStr: string, proofUrlStr: string): boolean {
  if (proofUrlStr === 'gratuito') return true;
  if (!priceStr) return false;
  const p = priceStr.toLowerCase().trim();
  return p === 'gratuito' || p === 'grátis' || p === '0' || p === '0 mt' || p === '0mt' || p === 'free';
}

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado. Por favor, faça login.' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ success: false, error: 'Sessão inválida.' }, { status: 401 });
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
      return NextResponse.json({ success: false, error: 'Não autenticado. Faça login para continuar.' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ success: false, error: 'Sessão de utilizador inválida.' }, { status: 401 });
    }

    const body = await request.json();
    const { itemName, price, proofUrl, phone, company } = body || {};

    if (!itemName || !price || !proofUrl) {
      return NextResponse.json({ error: 'Comprovativo e detalhes do curso são obrigatórios.' }, { status: 400 });
    }

    // Safely check if enrollment already exists without regex SyntaxError
    const escapedItemName = escapeRegExp(String(itemName).trim());
    const existingPayment = await Payment.findOne({
      user: session.id,
      itemName: { $regex: new RegExp(`^${escapedItemName}$`, 'i') },
      status: { $in: ['pendente', 'aprovado'] }
    });

    if (existingPayment) {
      return NextResponse.json({ 
        error: 'Já se encontra inscrito ou com a inscrição a aguardar validação para este curso.' 
      }, { status: 400 });
    }

    // Determine initial status: free courses are instantly approved
    const free = isPriceFree(String(price), String(proofUrl));
    const initialStatus = free ? 'aprovado' : 'pendente';

    const payment = await Payment.create({
      user: session.id,
      itemName: String(itemName).trim(),
      price: String(price).trim(),
      proofUrl: String(proofUrl).trim(),
      phone: phone || '',
      company: company || '',
      status: initialStatus
    });

    // Create Notification if auto-approved
    if (initialStatus === 'aprovado') {
      try {
        await Notification.create({
          user: session.id,
          title: 'Inscrição Confirmada! 🎓',
          message: `A sua inscrição no curso "${payment.itemName}" foi efetuada com sucesso. Já pode assistir às aulas!`,
          link: '/dashboard/formacao'
        });
      } catch (notifErr) {
        console.error('Notification creation warning:', notifErr);
      }
    }

    // Format WhatsApp Alert link for Admin
    const adminPhone = process.env.ADMIN_WHATSAPP || '245955000000';
    const studentName = session.name || 'Aluno';
    const waText = encodeURIComponent(
      `🚨 *Novo Comprovativo Recebido!*\n\n📚 *Curso:* ${itemName}\n👤 *Aluno:* ${studentName}\n📱 *Contacto:* ${phone || 'N/A'}\n🏢 *Empresa:* ${company || 'N/A'}\n💰 *Valor:* ${price}\n\nPor favor, valide no painel Admin em /admin/pagamentos`
    );
    const waUrl = `https://api.whatsapp.com/send?phone=${adminPhone}&text=${waText}`;

    return NextResponse.json({ success: true, payment, adminWaUrl: waUrl });
  } catch (error: any) {
    console.error('Error in POST /api/payments:', error);
    return NextResponse.json({ error: error.message || 'Erro interno ao processar inscrição.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado.' }, { status: 401 });
    }

    let session;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ success: false, error: 'Sessão inválida.' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentId, status, completed, completedLessons, certificateRequested } = body || {};

    if (!paymentId) {
      return NextResponse.json({ error: 'ID do pagamento é obrigatório.' }, { status: 400 });
    }

    if (status !== undefined) {
      const checkPayment = await Payment.findById(paymentId);
      if (!checkPayment) {
        return NextResponse.json({ error: 'Pagamento não encontrado.' }, { status: 404 });
      }

      if (session.role !== 'admin') {
        const isFree = isPriceFree(checkPayment.price, checkPayment.proofUrl);
        const isOwner = checkPayment.user.toString() === session.id;
        if (isFree && isOwner && status === 'aprovado') {
          // Allowed for free course auto-approval
        } else {
          return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
        }
      }

      const payment = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true });

      // Create Real-Time Bell Notification for Student
      if (status === 'aprovado') {
        await Notification.create({
          user: payment.user,
          title: 'Inscrição Aprovada! 🎓',
          message: `A sua inscrição no curso "${payment.itemName}" foi aprovada com sucesso. Já pode assistir a todas as aulas!`,
          link: '/dashboard/formacao'
        });
      } else if (status === 'rejeitado') {
        await Notification.create({
          user: payment.user,
          title: 'Comprovativo Rejeitado ❌',
          message: `O comprovativo enviado para o curso "${payment.itemName}" foi rejeitado. Por favor, verifique e reenvie.`,
          link: '/dashboard/formacao'
        });
      }

      // Send confirmation email via Resend if approved
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
                    <a href="https://abnafrobiznetwork.com/login" style="background: #ff6b00; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; display: inline-block;">Iniciar Aulas Agora</a>
                  </p>
                  <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                  <p style="font-size: 0.8rem; color: #888; text-align: center;">AfroBiz Network Lda. Todos os direitos reservados.</p>
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

    // Progress updates (completed, completedLessons, certificateRequested)
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
    if (completedLessons !== undefined) updates.completedLessons = completedLessons;
    if (certificateRequested !== undefined) updates.certificateRequested = certificateRequested;

    const updatedPayment = await Payment.findByIdAndUpdate(paymentId, updates, { new: true });
    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
