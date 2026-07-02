import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ServiceRequest from '@/models/ServiceRequest';
import Contact from '@/models/Contact';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, email, phone, service, servicePrice, company, timeline, description } = await request.json();

    if (!name || !email || !service || !description) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 });
    }

    // Save as ServiceRequest
    const serviceRequest = await ServiceRequest.create({
      name,
      email,
      phone,
      service,
      servicePrice,
      company,
      timeline,
      description
    });

    // Also create a backup entry in the general messages (Contact) list
    await Contact.create({
      name,
      email,
      message: `[Solicitação de Serviço: ${service}] (Preço: ${servicePrice})\n` +
               `WhatsApp/Telefone: ${phone}\n` +
               `Empresa/Startup: ${company || 'Não informada'}\n` +
               `Expectativa de Início: ${timeline}\n\n` +
               `Mensagem/Necessidade:\n${description}`
    });

    return NextResponse.json({ success: true, serviceRequest });
  } catch (error: any) {
    console.error('Request submission error:', error);
    return NextResponse.json({ error: 'Erro ao enviar solicitação.' }, { status: 500 });
  }
}
