import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Hub from '@/models/Hub';

// Helper for admin authentication
async function verifyAdmin(request: NextRequest) {
  const sessionCookie = request.cookies.get('abn_session');
  if (!sessionCookie) return false;
  
  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie.value));
    return session?.role === 'admin';
  } catch {
    return false;
  }
}

// GET single hub by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();
    const { slug } = await params;
    const hub = await Hub.findOne({ slug: slug.toLowerCase().trim() });
    
    if (!hub) {
      return NextResponse.json({ success: false, error: 'Delegação não encontrada.' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, hub });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT update hub details (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 1. Auth check
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Acesso negado.' }, { status: 403 });
    }

    // 2. Connect DB
    await dbConnect();
    const { slug } = await params;

    // 3. Read body
    const body = await request.json();
    const { 
      name, 
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

    const updated = await Hub.findOneAndUpdate(
      { slug: slug.toLowerCase().trim() },
      {
        name,
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
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Delegação não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, hub: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE hub (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // 1. Auth check
    const isAdmin = await verifyAdmin(request);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Acesso negado.' }, { status: 403 });
    }

    // 2. Connect DB
    await dbConnect();
    const { slug } = await params;

    const deleted = await Hub.findOneAndDelete({ slug: slug.toLowerCase().trim() });
    
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Delegação não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Delegação removida com sucesso.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
