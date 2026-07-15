import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Course from '@/models/Course';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let courses = await Course.find({}).sort({ createdAt: 1 });

    // Seed default courses if database is empty
    if (courses.length === 0) {
      courses = await Course.create([
        {
          title: 'Inovação e Modelos de Negócio Verdes',
          instructor: 'Prof. Amadou Diallo',
          duration: '12h',
          lessons: 8,
          price: 'Gratuito',
          isPaid: false,
          desc: 'Aprenda a estruturar modelos de negócio circulares e sustentáveis adaptados ao mercado africano.'
        },
        {
          title: 'Fundamentos de Pitching para Startups',
          instructor: 'Rita Santos (Mentora ABN)',
          duration: '6h',
          lessons: 4,
          price: '5.000 MT',
          isPaid: true,
          desc: 'Domine a arte de apresentar a sua ideia de negócio a investidores e parceiros globais em poucos minutos.'
        },
        {
          title: 'Certificação em Gestão de Microfomento',
          instructor: 'Banco de Microfomento',
          duration: '15h',
          lessons: 10,
          price: '15.000 MT',
          isPaid: true,
          desc: 'Adquira competências financeiras e de compliance cruciais para gerir microcréditos e fundos de apoio.'
        }
      ]);
    }

    return NextResponse.json({ success: true, courses });
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

    const { 
      title, instructor, duration, lessons, price, isPaid, desc, videoUrl, videoVisible, lessonsList,
      certBgColor, certTextColor, certUsePartnerLogos, certPartnerLogoUrl
    } = await request.json();

    if (!title || !instructor || !duration || !lessons || !price || desc === undefined) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const course = await Course.create({
      title,
      instructor,
      duration,
      lessons,
      price,
      isPaid,
      desc,
      videoUrl: videoUrl || '',
      videoVisible: videoVisible !== false,
      lessonsList: lessonsList || [],
      certBgColor: certBgColor || '#ff6b00',
      certTextColor: certTextColor || '#1c1917',
      certUsePartnerLogos: certUsePartnerLogos === true,
      certPartnerLogoUrl: certPartnerLogoUrl || ''
    });

    return NextResponse.json({ success: true, course });
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

    const { 
      id, title, instructor, duration, lessons, price, isPaid, desc, videoUrl, videoVisible, lessonsList,
      certBgColor, certTextColor, certUsePartnerLogos, certPartnerLogoUrl
    } = await request.json();

    if (!id || !title || !instructor || !duration || !lessons || !price || desc === undefined) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { 
        title, instructor, duration, lessons, price, isPaid, desc, 
        videoUrl: videoUrl || '', videoVisible: videoVisible !== false, lessonsList: lessonsList || [],
        certBgColor: certBgColor || '#ff6b00',
        certTextColor: certTextColor || '#1c1917',
        certUsePartnerLogos: certUsePartnerLogos === true,
        certPartnerLogoUrl: certPartnerLogoUrl || ''
      },
      { new: true }
    );

    if (!course) {
      return NextResponse.json({ error: 'Curso não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, course });
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
      return NextResponse.json({ error: 'ID do curso é obrigatório.' }, { status: 400 });
    }

    await Course.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Curso removido.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
