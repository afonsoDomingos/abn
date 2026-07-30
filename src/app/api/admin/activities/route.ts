import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const assignedTo = searchParams.get('assignedTo');
    const department = searchParams.get('department');
    const status = searchParams.get('status');

    let query: any = {};
    if (assignedTo) query.assignedTo = assignedTo;
    if (department) query.department = department;
    if (status) query.status = status;

    const activities = await Activity.find(query)
      .populate('assignedTo', 'name email department')
      .populate('createdBy', 'name email')
      .sort({ deadline: 1, createdAt: -1 });

    return NextResponse.json({ success: true, activities });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar atividades.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { title, description, assignedTo, department, deadline, priority, createdBy } = await request.json();
    
    const activity = await Activity.create({
      title,
      description: description || '',
      assignedTo,
      department,
      deadline: deadline ? new Date(deadline) : null,
      priority: priority || 'medium',
      createdBy,
      status: 'pending'
    });

    const populatedActivity = await Activity.findById(activity._id)
      .populate('assignedTo', 'name email department')
      .populate('createdBy', 'name email');

    return NextResponse.json({ success: true, activity: populatedActivity });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao criar atividade.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, title, description, status, priority, deadline } = await request.json();
    
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;

    const activity = await Activity.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email department')
     .populate('createdBy', 'name email');

    return NextResponse.json({ success: true, activity });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar atividade.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { id } = await request.json();
    await Activity.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Atividade removida.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao remover atividade.' }, { status: 500 });
  }
}
