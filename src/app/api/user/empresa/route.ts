import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import Business from "@/models/Business";

export const dynamic = "force-dynamic";

async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("abn_session");
  if (!sessionCookie) return null;
  try {
    return JSON.parse(decodeURIComponent(sessionCookie.value));
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Nao autenticado" }, { status: 401 });
    }

    let business = await Business.findOne({ owner: session.id });
    if (!business) {
      business = await Business.create({
        owner: session.id,
        name: "Minha Empresa",
        category: "Comercio & Industria",
        description: "Empresa estabelecida no ecossistema ABN.",
        incubationPhase: "Crescimento"
      });
    }

    const activeConnect = (business.businessConnect || []).filter(
      (c: any) => c.status === "ativo" || c.status === "em_negociacao"
    );

    return NextResponse.json({ success: true, business, activeConnect });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Nao autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { empresaProfile, businessConnect, desenvolvimento, name, description, website, location } = body;

    const updateData: any = {};
    if (empresaProfile) updateData.empresaProfile = empresaProfile;
    if (businessConnect) updateData.businessConnect = businessConnect;
    if (desenvolvimento) updateData.desenvolvimento = desenvolvimento;
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;
    if (location !== undefined) updateData.location = location;

    const updated = await Business.findOneAndUpdate(
      { owner: session.id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, business: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Nao autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { action, connectRequest, connectId, item } = body;

    const business = await Business.findOne({ owner: session.id });
    if (!business) {
      return NextResponse.json({ success: false, error: "Empresa nao encontrada" }, { status: 404 });
    }

    if (action === "publish_connect") {
      if (!connectRequest?.type || !connectRequest?.title) {
        return NextResponse.json({ success: false, error: "Tipo e titulo sao obrigatorios" }, { status: 400 });
      }
      business.businessConnect = business.businessConnect || [];
      business.businessConnect.push({
        ...connectRequest,
        status: "ativo",
        responses: 0,
        matches: [],
        publishedAt: new Date()
      });
      await business.save();
      return NextResponse.json({ success: true, message: "Pedido Business Connect publicado!" });
    }

    if (action === "close_connect") {
      const connectItem = business.businessConnect?.id(connectId);
      if (connectItem) {
        connectItem.status = "concluido";
        await business.save();
      }
      return NextResponse.json({ success: true, message: "Pedido encerrado." });
    }

    if (action === "add_desenvolvimento") {
      business.desenvolvimento = business.desenvolvimento || [];
      business.desenvolvimento.push(item);
      await business.save();
      return NextResponse.json({ success: true, message: "Servico adicionado." });
    }

    return NextResponse.json({ success: false, error: "Acao nao reconhecida" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
