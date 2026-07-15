import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    // Auth Check
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

    if (session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Acesso negado.' }, { status: 403 });
    }

    const { subject, html } = await request.json();

    if (!subject || !html) {
      return NextResponse.json({ success: false, error: 'O assunto e o corpo do e-mail são obrigatórios.' }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'A chave da API do Resend (RESEND_API_KEY) não está configurada no servidor (.env.local).' 
      }, { status: 500 });
    }

    // Get all users with valid emails
    const users = await User.find({ email: { $exists: true } }).select('email name');
    const emails: string[] = users.map(u => u.email).filter(Boolean);

    if (emails.length === 0) {
      return NextResponse.json({ success: false, error: 'Nenhum utilizador com e-mail registado encontrado.' }, { status: 400 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'ABN - AfroBiz Network <onboarding@resend.dev>';
    const toEmail = process.env.RESEND_TO_EMAIL || 'comunicacao@afrobiznet.com';

    // Broadcast logic using BCC in chunks of 50 (Resend limits)
    const batchSize = 50;
    let sentCount = 0;
    let errors: string[] = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const chunk = emails.slice(i, i + batchSize);
      
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromEmail,
            to: toEmail,
            bcc: chunk,
            subject: subject,
            html: html
          })
        });

        const resData = await response.json();
        
        if (!response.ok) {
          errors.push(resData.message || `Erro HTTP ${response.status}`);
        } else {
          sentCount += chunk.length;
        }
      } catch (err: any) {
        errors.push(err.message || 'Erro de rede desconhecido.');
      }
    }

    if (errors.length > 0 && sentCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Erro ao enviar e-mails: ${errors.join(', ')}. Certifique-se de que configurou um domínio verificado no Resend se estiver a enviar para terceiros.`
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      sentCount, 
      totalUsers: emails.length,
      warning: errors.length > 0 ? `Alguns lotes falharam: ${errors.join(', ')}` : undefined
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
