import { Metadata } from 'next';
import CountryHubClient from './CountryHubClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  const countryNames: Record<string, string> = {
    quinebissau: 'Guiné-Bissau',
    angola: 'Angola',
    caboverde: 'Cabo Verde',
    saotome: 'São Tomé e Príncipe',
    mocambique: 'Moçambique'
  };
  
  const countryName = countryNames[slug] || slug;
  
  return {
    title: `ABN ${countryName} – Representação Nacional`,
    description: `Delegação ABN em ${countryName}: incubação, formação, mentoria e networking para empreendedores locais.`,
    openGraph: {
      title: `ABN ${countryName} – Representação Nacional`,
      description: `Delegação ABN em ${countryName}: incubação, formação, mentoria e networking para empreendedores locais.`,
      url: `https://abnafrobiznetwork.com/country/${slug}`,
    },
  };
}

export default function CountryHubPage({ params }: { params: Promise<{ slug: string }> }) {
  return <CountryHubClient params={params} />;
}
