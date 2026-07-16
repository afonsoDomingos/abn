import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/mongodb';
import Config from '@/models/Config';
import ImpactoClient from './ImpactoClient';
import styles from './ImpactoPublic.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nosso Impacto - AfroBiz Network (ABN)',
  description: 'Conheça o impacto da Afrobiz Network através de estatísticas, relatórios de atividade, casos de sucesso e startups incubadas em África.',
};

export default async function ImpactoPage() {
  await dbConnect();
  
  const configs = await Config.find({
    key: { $in: ['stats_content', 'reports_content', 'cases_content', 'supported_companies'] }
  }).lean();

  const configMap: Record<string, any> = {};
  configs.forEach((c: any) => {
    configMap[c.key] = c.value;
  });

  // Fallbacks
  const stats = configMap['stats_content'] || [
    { value: '968', label: 'Alumni' },
    { value: '14+', label: 'Parceiros Privados' },
    { value: '13%', label: 'Mulheres Empreendedoras' },
    { value: '5K+', label: 'Empregos Apoiados' }
  ];

  const reports = configMap['reports_content'] || [
    { title: 'Relatório de Impacto ABN 2025', year: '2025', fileUrl: '' },
    { title: 'Relatório de Atividades Orange Corners Moçambique 2024', year: '2024', fileUrl: '' }
  ];

  const cases = configMap['cases_content'] || [
    {
      title: 'Nilza Mazive e Xiphefu: energia inteligente para Moçambique',
      desc: 'Como a empreendedora Nilza Mazive desenvolveu soluções de iluminação inteligente e sustentável que impactaram a vida de comunidades rurais.',
      img: '/articles/nilza.png',
      category: 'Energia Renovável',
      statsSnippet: 'Energia limpa para centenas de famílias'
    },
    {
      title: 'Gala de Empreendedorismo Orange Corners',
      desc: 'Evento anual promovido pelo Orange Corners Moçambique que reuniu centenas de ex-alunos e investidores para celebrar o desenvolvimento socioeconómico.',
      img: '/articles/gala.png',
      category: 'Ecossistema',
      statsSnippet: 'Mais de 20 investidores presentes'
    }
  ];

  const rawCompanies = configMap['supported_companies'] || [
    { name: 'Xiphefu', location: 'Maputo, Moçambique', desc: 'Soluções inteligentes de iluminação.', icon: '🏢', phase: 'Crescimento', type: 'incubada' }
  ];

  // Map type default to 'incubada' for older entries
  const companies = rawCompanies.map((c: any) => ({
    name: c.name || '',
    location: c.location || '',
    desc: c.desc || '',
    icon: c.icon || '🏢',
    phase: c.phase || '',
    type: c.type || 'incubada'
  }));

  return (
    <main className={styles.impactoPage}>
      <Navbar />
      
      <header className={styles.hero}>
        <div className={styles.container}>
          <h1 className="text-gradient-gold">Nosso Impacto</h1>
          <p>
            Transformamos o ecossistema empreendedor através da capacitação prática, mentoria especializada e conexão a mercados e capitais em África.
          </p>
        </div>
      </header>

      <ImpactoClient
        stats={stats}
        reports={reports}
        cases={cases}
        companies={companies}
      />
    </main>
  );
}
