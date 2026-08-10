import { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import Program from '@/models/Program';
import ProgramaDetalheClient, { FALLBACK_PROGRAMS } from './ProgramaDetalheClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams?.id || '';

  let programData: any = null;
  try {
    await dbConnect();
    programData = await Program.findById(id).lean();
  } catch {}

  if (!programData) {
    programData = FALLBACK_PROGRAMS.find(p => p._id === id || p._id.includes(id));
  }

  const title = programData ? `${programData.title} | ABN – AfroBiz Network` : 'Programa ABN – AfroBiz Network';
  const rawDesc = programData?.description || 'Conheça os programas de incubação, aceleração e desenvolvimento empresarial da ABN – AfroBiz Network.';
  const description = rawDesc.replace(/\n/g, ' ').slice(0, 180).trim() + '...';
  
  const rawImage = programData?.image || '/hero_entrepreneurs.png';
  const fullImageUrl = rawImage.startsWith('http') ? rawImage : `https://abnafrobiznetwork.com${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
  const pageUrl = `https://abnafrobiznetwork.com/programas/${id}`;

  return {
    title,
    description,
    openGraph: {
      title: programData?.title || 'Programa ABN – AfroBiz Network',
      description,
      url: pageUrl,
      siteName: 'ABN – AfroBiz Network',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: programData?.title || 'Programa ABN',
        },
      ],
      locale: 'pt_MZ',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: programData?.title || 'Programa ABN – AfroBiz Network',
      description,
      images: [fullImageUrl],
    },
  };
}

export default async function ProgramaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || '';

  let initialProgram: any = null;
  try {
    await dbConnect();
    initialProgram = await Program.findById(id).lean();
    if (initialProgram) {
      initialProgram = JSON.parse(JSON.stringify(initialProgram));
    }
  } catch {}

  if (!initialProgram) {
    initialProgram = FALLBACK_PROGRAMS.find(p => p._id === id) || null;
  }

  return <ProgramaDetalheClient id={id} initialProgram={initialProgram} />;
}
