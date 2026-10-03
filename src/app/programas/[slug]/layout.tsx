import { Metadata } from 'next';

interface Program {
  _id: string;
  title: string;
  description: string;
  duration: string;
  beneficios: string;
  requisitos: string;
  publicoAlvo: string;
  investimento: string;
  processoSelecao: string;
  criteriosSelecao: string;
  phase: string;
  status: string;
  image?: string;
}

interface LayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const baseUrl = 'https://www.abnafrobiznetwork.com';
    const res = await fetch(`${baseUrl}/api/programs`, {
      cache: 'no-store'
    });
    const data = await res.json();

    if (data.success && data.programs) {
      const program = data.programs.find((p: Program) => {
        const titleSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return titleSlug === slug || p._id === slug;
      });

      if (program) {
        const shortDescription = program.description.split('\n')[0] || program.description;
        const imageUrl = program.image || 'https://www.abnafrobiznetwork.com/abn-logo.png';

        return {
          title: `${program.title} - ABN AfroBiz Network`,
          description: shortDescription,
          openGraph: {
            title: program.title,
            description: shortDescription,
            url: `${baseUrl}/programas/${slug}`,
            siteName: 'ABN - AfroBiz Network',
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
              },
            ],
            locale: 'pt_PT',
            type: 'article',
          },
          twitter: {
            card: 'summary_large_image',
            title: program.title,
            description: shortDescription,
            images: [imageUrl],
          },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching program for metadata:', error);
  }

  return {
    title: 'Programa - ABN AfroBiz Network',
    description: 'Programas de incubação, aceleração e capacitação para empreendedores africanos.',
  };
}

export default function ProgramLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
