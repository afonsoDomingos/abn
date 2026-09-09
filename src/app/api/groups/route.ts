import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Group from '@/models/Group';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');
    
    let currentUserId: string | null = null;
    if (sessionCookie) {
      try {
        const session = JSON.parse(decodeURIComponent(sessionCookie.value));
        currentUserId = session.id || session._id;
      } catch {}
    }

    const groups = await Group.find({})
      .populate('creator', 'name profileImage role')
      .sort({ createdAt: -1 });

    // Se a coleção estiver vazia, inicializar alguns grupos padrão do ecossistema ABN
    if (groups.length === 0 && currentUserId) {
      const defaultGroups = [
        {
          name: 'AgroTech & Negócios Rurais',
          category: 'Agro-negócio',
          description: 'Comunidade dedicada a fundadores, agrônomos e investidores em inovação para o campo.',
          creator: currentUserId,
          members: [currentUserId]
        },
        {
          name: 'Fintech & Pagamentos Digitais',
          category: 'Fintech',
          description: 'Discussão sobre inclusão financeira, gateways de pagamento, regulação e microcrédito.',
          creator: currentUserId,
          members: [currentUserId]
        },
        {
          name: 'Clube de Investimento Anjo & VC',
          category: 'Investimento',
          description: 'Troca de teses, co-investimento e partilha de dealflow entre investidores e fundadores.',
          creator: currentUserId,
          members: [currentUserId]
        },
        {
          name: 'Mulheres Empreendedoras Lusófonas',
          category: 'Liderança',
          description: 'Rede de apoio, mentoria e aceleração para negócios liderados por mulheres.',
          creator: currentUserId,
          members: [currentUserId]
        }
      ];

      await Group.insertMany(defaultGroups);
      const reloaded = await Group.find({})
        .populate('creator', 'name profileImage role')
        .sort({ createdAt: -1 });

      const mapped = reloaded.map(g => ({
        id: g._id,
        name: g.name,
        category: g.category,
        description: g.description,
        creator: g.creator,
        membersCount: g.members?.length || 0,
        isMember: currentUserId ? g.members?.some((m: any) => String(m) === String(currentUserId)) : false,
        createdAt: g.createdAt
      }));

      return NextResponse.json({ success: true, groups: mapped });
    }

    const mapped = groups.map(g => ({
      id: g._id,
      name: g.name,
      category: g.category,
      description: g.description,
      creator: g.creator,
      membersCount: g.members?.length || 0,
      isMember: currentUserId ? g.members?.some((m: any) => String(m) === String(currentUserId)) : false,
      createdAt: g.createdAt
    }));

    return NextResponse.json({ success: true, groups: mapped });
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

    const body = await request.json();
    const { action, name, category, description, groupId } = body;

    // Ação 1: Criar novo Grupo
    if (action === 'create') {
      if (!name || !name.trim()) {
        return NextResponse.json({ error: 'O nome do grupo é obrigatório.' }, { status: 400 });
      }

      const newGroup = await Group.create({
        name: name.trim(),
        category: category || 'Geral',
        description: description || '',
        creator: session.id,
        members: [session.id]
      });

      return NextResponse.json({ success: true, group: newGroup });
    }

    // Ação 2: Entrar / Sair do Grupo
    if (action === 'toggle_join') {
      if (!groupId) {
        return NextResponse.json({ error: 'ID do grupo é obrigatório.' }, { status: 400 });
      }

      const group = await Group.findById(groupId);
      if (!group) {
        return NextResponse.json({ error: 'Grupo não encontrado.' }, { status: 404 });
      }

      const isMember = group.members.some((m: any) => String(m) === String(session.id));

      if (isMember) {
        group.members = group.members.filter((m: any) => String(m) !== String(session.id));
      } else {
        group.members.push(session.id);
      }

      await group.save();
      return NextResponse.json({ success: true, isMember: !isMember, membersCount: group.members.length });
    }

    return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
