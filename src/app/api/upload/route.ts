import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum ficheiro enviado.' }, { status: 400 });
    }

    // Convert File to base64 Data URL for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type;
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${mimeType};base64,${base64Data}`;

    // Upload to Cloudinary in the "partners" folder
    const imageUrl = await uploadImage(fileUri, 'partners');

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Falha ao fazer upload da imagem.' }, { status: 500 });
  }
}
