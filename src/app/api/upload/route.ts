import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum ficheiro enviado.' }, { status: 400 });
    }

    // Verificar se as credenciais do Cloudinary estão configuradas
    const isCloudinaryConfigured = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET;

    if (isCloudinaryConfigured) {
      // Converter Ficheiro para base64 Data URL para upload no Cloudinary
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type;
      const base64Data = buffer.toString('base64');
      const fileUri = `data:${mimeType};base64,${base64Data}`;

      // Upload para Cloudinary no directório "partners"
      const imageUrl = await uploadImage(fileUri, 'partners');
      return NextResponse.json({ success: true, url: imageUrl });
    } else {
      // Fallback: Gravar ficheiro localmente na pasta public/uploads/
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Criar directório caso não exista
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Gerar um nome de ficheiro único
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.name) || '.jpg';
      const filename = `${uniqueSuffix}${ext}`;
      const filePath = path.join(uploadDir, filename);

      // Escrever ficheiro no disco
      fs.writeFileSync(filePath, buffer);

      const localUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: localUrl });
    }
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Falha ao fazer upload da imagem.' }, { status: 500 });
  }
}
