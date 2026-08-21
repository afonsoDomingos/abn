import { NextRequest, NextResponse } from 'next/server';
import Questionnaire from '@/models/Questionnaire';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const questionnaires = await Questionnaire.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, questionnaires });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const body = await req.json();
    const { title, description, fields, status } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Título é obrigatório' }, { status: 400 });
    }

    const questionnaire = await Questionnaire.create({
      title,
      description,
      fields: fields || [],
      status: status || 'ativo'
    });

    return NextResponse.json({ success: true, questionnaire });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const body = await req.json();
    const { id, title, description, fields, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }

    const questionnaire = await Questionnaire.findByIdAndUpdate(
      id,
      { title, description, fields, status, updatedAt: new Date() },
      { new: true }
    );

    if (!questionnaire) {
      return NextResponse.json({ success: false, error: 'Inquérito não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, questionnaire });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID é obrigatório' }, { status: 400 });
    }

    const questionnaire = await Questionnaire.findByIdAndDelete(id);

    if (!questionnaire) {
      return NextResponse.json({ success: false, error: 'Inquérito não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Inquérito removido com sucesso' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
