import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programas ABN - AfroBiz Network',
  description: 'Programas de incubação, aceleração e capacitação para empreendedores africanos.',
  openGraph: {
    title: 'Programas ABN - AfroBiz Network',
    description: 'Programas de incubação, aceleração e capacitação para empreendedores africanos.',
    url: 'https://www.abnafrobiznetwork.com/programas',
    siteName: 'ABN - AfroBiz Network',
    images: [
      {
        url: 'https://www.abnafrobiznetwork.com/abn-logo.png',
        width: 1200,
        height: 630,
        alt: 'ABN AfroBiz Network',
      },
    ],
    locale: 'pt_PT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Programas ABN - AfroBiz Network',
    description: 'Programas de incubação, aceleração e capacitação para empreendedores africanos.',
    images: ['https://www.abnafrobiznetwork.com/abn-logo.png'],
  },
  other: {
    'og:image:alt': 'ABN AfroBiz Network',
    'og:image:width': '1200',
    'og:image:height': '630',
  },
};

export default function ProgramasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
