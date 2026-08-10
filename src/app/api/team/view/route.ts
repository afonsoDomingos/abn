import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { id, name, slug } = await request.json();
    await dbConnect();

    let member = null;
    if (id && !id.startsWith('fs')) {
      member = await Team.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );
    } else if (name) {
      member = await Team.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { $inc: { views: 1 } },
        { new: true }
      );
    }

    if (member) {
      return NextResponse.json({ success: true, views: member.views || 1 });
    }

    return NextResponse.json({ success: true, views: 1, isFallback: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
