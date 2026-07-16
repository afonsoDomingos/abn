import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { id, name, text } = await request.json();

    if (!id || !name || !text) {
      return NextResponse.json({ error: 'ID, nome e texto são obrigatórios.' }, { status: 400 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Conteúdo não encontrado' }, { status: 404 });
    }

    const newComment = {
      name,
      text,
      date: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
