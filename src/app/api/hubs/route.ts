import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Hub from '@/models/Hub';

export const dynamic = 'force-dynamic';

// GET all hubs (simple list)
export async function GET() {
  try {
    await dbConnect();
    const hubs = await Hub.find({}, 'name slug image description').sort({ name: 1 });
    return NextResponse.json({ success: true, hubs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST create a new hub (admin only)
export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const sessionCookie = request.cookies.get('abn_session');
    if (!sessionCookie) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }
    
    let session;
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      return NextResponse.json({ success: false, error: 'Sessão inválida.' }, { status: 401 });
    }

    if (session?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Acesso negado.' }, { status: 403 });
    }

    // 2. Connect DB
    await dbConnect();

    // 3. Read body
    const body = await request.json();
    const { 
      name, 
      slug, 
      image, 
      description, 
      steps, 
      faqs, 
      address, 
      email, 
      phone,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      youtubeUrl,
      events,
      representative,
      team,
      partners
    } = body;

    if (!name || !slug || !image || !description || !address || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Preencha todos os campos obrigatórios.' }, { status: 400 });
    }

    // Check unique slug
    const existing = await Hub.findOne({ slug: slug.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Uma delegação com este Slug já existe.' }, { status: 400 });
    }

    const newHub = await Hub.create({
      name,
      slug: slug.toLowerCase().trim(),
      image,
      description,
      steps: steps || [
        { title: 'Fase de Candidatura', description: 'Preencha o formulário online detalhando o seu negócio.' },
        { title: 'Entrevista & Pitching', description: 'Apresente a sua equipa e proposta de valor a investidores.' },
        { title: 'Incubação Activa', description: 'Aceda a mentoria estratégica e ferramentas de escala global.' }
      ],
      faqs: faqs || [],
      address,
      email,
      phone,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      youtubeUrl,
      events: events || [],
      representative: representative || { name: '', role: '', email: '', phone: '', image: '/default-avatar.png' },
      team: team || [],
      partners: partners || []
    });

    return NextResponse.json({ success: true, hub: newHub });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
