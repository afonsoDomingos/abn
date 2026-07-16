import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    // If ID is provided, increment views and return single post
    if (id) {
      const post = await Post.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
      if (!post) {
        return NextResponse.json({ error: 'Conteúdo não encontrado' }, { status: 404 });
      }
      return NextResponse.json({ success: true, post });
    }

    // Filters
    const query: any = {};
    if (section) query.section = section;
    if (type) query.type = type;

    let posts = await Post.find(query).sort({ date: -1, createdAt: -1 });

    // Seed initial posts if empty
    if (posts.length === 0 && !section && !type) {
      posts = await Post.create([
        {
          title: 'Orange Corners Moçambique: Dia do Embaixador',
          content: 'Nossos embaixadores estudantis desempenham um papel fundamental na conexão do Orange Corners com estudantes universitários, inspirando curiosidade e gerando interesse em programas de empreendedorismo através de workshops e palestras inovadoras.',
          section: 'news',
          type: 'news',
          date: '2026-06-02',
          location: 'Moçambique',
          imageUrl: '/articles/ambassador-day.png',
          views: 120
        },
        {
          title: 'Nilza Mazive e Xiphefu: energia inteligente',
          content: 'Num país onde apenas cerca de 40% da população tem acesso à eletricidade, poupar energia e criar soluções renováveis é essencial para o desenvolvimento rural. A fundadora Nilza Mazive desenvolveu soluções de iluminação inteligente que estão a iluminar vidas e a acelerar a transição ecológica.',
          section: 'news',
          type: 'sucesso',
          date: '2025-08-25',
          location: 'Moçambique',
          imageUrl: '/articles/nilza.png',
          views: 94
        },
        {
          title: 'Summit ABN 2026 anunciado oficialmente',
          content: 'A Afrobiz Network acaba de anunciar as datas oficiais para o Summit ABN 2026. O maior evento de investimento de impacto na África austral irá decorrer no final do ano com a presença de mais de 20 investidores internacionais e painelistas renomados.',
          section: 'news',
          type: 'comunicado',
          date: '2026-07-16',
          location: 'Geral',
          imageUrl: '/articles/gala.png',
          views: 145
        },
        {
          title: 'Gala de Empreendedorismo Orange Corners',
          content: 'Fotografias e momentos marcantes do Orange Corners Entrepreneurship Gala, que reuniu dezenas de ex-alunos, mentores, apoiadores governamentais e corporações para celebrar o progresso socioeconómico local.',
          section: 'gallery',
          type: 'photo',
          date: '2025-11-28',
          location: 'Moçambique',
          imageUrl: '/articles/gala.png',
          views: 89
        },
        {
          title: 'Como Apresentar seu Pitch para Investidores',
          content: 'Assista a este guia em vídeo completo que ensina passo a passo como estruturar seu deck, falar em público com clareza, gerenciar as perguntas e capturar a atenção de anjos e fundos de venture capital.',
          section: 'gallery',
          type: 'video',
          date: '2026-04-10',
          location: 'Online',
          imageUrl: '/articles/ambassador-day.png',
          mediaUrl: 'https://www.youtube.com/watch?v=BI1wkCFnuGY',
          views: 310
        },
        {
          title: 'AfroBiz Podcast - Ep 12: Nilza Mazive',
          content: 'Conversamos com a fundadora da Xiphefu sobre inovação limpa, automação industrial básica em África e como os ecossistemas locais ajudam no crescimento de ideias disruptivas na base da pirâmide.',
          section: 'gallery',
          type: 'podcast',
          date: '2026-05-18',
          location: 'Maputo',
          imageUrl: '/articles/nilza.png',
          mediaUrl: 'https://soundcloud.com',
          views: 74
        },
        {
          title: 'Guia de Sobrevivência para Startups 2026',
          content: 'Um manual prático completo desenvolvido pelo time da ABN com planilhas de controle de fluxo de caixa, frameworks de validação rápida de hipóteses e templates de propostas comerciais.',
          section: 'gallery',
          type: 'publication',
          date: '2026-01-15',
          location: 'Global',
          imageUrl: '/articles/gala.png',
          mediaUrl: '',
          views: 204
        }
      ]);
    }

    return NextResponse.json({ success: true, posts });
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

    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const body = await request.json();
    const post = await Post.create(body);

    return NextResponse.json({ success: true, post });
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

    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID do conteúdo é obrigatório.' }, { status: 400 });
    }

    const post = await Post.findByIdAndUpdate(id, updateData, { new: true });

    if (!post) {
      return NextResponse.json({ error: 'Conteúdo não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
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

    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID do conteúdo é obrigatório.' }, { status: 400 });
    }

    await Post.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Conteúdo removido.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
