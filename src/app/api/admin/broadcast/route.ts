import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/email';

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
      return NextResponse.json({ success: false, error: 'Acesso negado. Apenas administradores podem enviar comunicações.' }, { status: 403 });
    }

    const { subject, html, recipientTarget = 'all', testEmail, specificEmail } = await request.json();

    if (!subject || !html) {
      return NextResponse.json({ success: false, error: 'O assunto e o corpo do e-mail são obrigatórios.' }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json({ 
        success: false, 
        error: 'A chave da API do Resend (RESEND_API_KEY) não está configurada no servidor.' 
      }, { status: 500 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;

    // Handle single test email
    if (recipientTarget === 'test') {
      if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
        return NextResponse.json({ success: false, error: 'Por favor, forneça um endereço de e-mail de teste válido.' }, { status: 400 });
      }

      try {
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: testEmail,
          subject: `[TESTE] ${subject}`,
          html: html,
        });

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        return NextResponse.json({ 
          success: true, 
          sentCount: 1, 
          totalUsers: 1,
          isTest: true,
          message: `E-mail de teste enviado com sucesso para ${testEmail}`
        });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message || 'Erro ao enviar e-mail de teste.' }, { status: 500 });
      }
    }

    // Handle sending to a single specific user
    if (recipientTarget === 'single') {
      if (!specificEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(specificEmail)) {
        return NextResponse.json({ success: false, error: 'Por favor, selecione ou introduza um e-mail de destinatário válido.' }, { status: 400 });
      }

      try {
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: specificEmail,
          subject: subject,
          html: html,
        });

        if (error) {
          return NextResponse.json({ success: false, error: error.message }, { status: 400 });
        }

        return NextResponse.json({ 
          success: true, 
          sentCount: 1, 
          totalUsers: 1,
          message: `E-mail enviado com sucesso para ${specificEmail}`
        });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message || 'Erro ao enviar e-mail para o utilizador.' }, { status: 500 });
      }
    }

    // Build database query based on target
    const filter: any = { email: { $exists: true, $ne: '' } };
    if (recipientTarget && recipientTarget !== 'all') {
      filter.role = recipientTarget;
    }

    const users = await User.find(filter).select('email name');
    const emails: string[] = users.map(u => u.email).filter(Boolean);

    if (emails.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nenhum utilizador encontrado para o público-alvo selecionado.' 
      }, { status: 400 });
    }

    // Broadcast logic using BCC in chunks of 50 (Resend limits)
    const batchSize = 50;
    let sentCount = 0;
    let errors: string[] = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const chunk = emails.slice(i, i + batchSize);
      
      try {
        const { data, error } = await resend.emails.send({
          from: fromEmail,
          to: fromEmail.includes('<') ? fromEmail.split('<')[1].replace('>', '').trim() : fromEmail,
          bcc: chunk,
          subject: subject,
          html: html,
        });

        if (error) {
          errors.push(error.message);
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
        error: `Erro ao enviar e-mails: ${errors.join(', ')}.` 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      sentCount, 
      totalUsers: emails.length,
      warning: errors.length > 0 ? `Alguns lotes falharam: ${errors.join(', ')}` : undefined
    });

  } catch (error: any) {
    console.error('Error in POST /api/admin/broadcast:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
