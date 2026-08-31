import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { sendProgramApplicationReceivedEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// POST — Submit a new contact message
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    const contact = await Contact.create({ name, email, message });

    // Send automated email if this is a program application
    if (message.includes('CANDIDATURA AO PROGRAMA:')) {
      const match = message.match(/CANDIDATURA AO PROGRAMA:\s*([^\]\n]+)/i);
      const programTitle = match ? match[1].trim() : 'Programa ABN';
      sendProgramApplicationReceivedEmail(email, name, programTitle).catch(err => {
        console.error('[Resend] Erro ao enviar email de candidatura a programa:', err);
      });
    }

    return NextResponse.json({ success: true, contact }, { status: 201 });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Erro ao enviar mensagem.' }, { status: 500 });
  }
}

// GET — List contact messages (admin gets all, user gets their own)
export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 });
    }

    let filter = {};
    try {
      const session = JSON.parse(decodeURIComponent(sessionCookie.value));
      if (session && session.role !== 'admin') {
        filter = { email: session.email };
      }
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Sessão inválida' }, { status: 401 });
    }

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, contacts });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar mensagens.' }, { status: 500 });
  }
}

// PUT — Update status of a message (for admin)
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID e status são obrigatórios.' }, { status: 400 });
    }

    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!contact) {
      return NextResponse.json({ error: 'Mensagem não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, contact });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar mensagem.' }, { status: 500 });
  }
}

// DELETE — Remove a contact message (for admin)
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { id } = await request.json();
    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Mensagem removida.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao remover mensagem.' }, { status: 500 });
  }
}
