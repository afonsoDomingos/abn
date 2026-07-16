import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/mongodb';
import Opportunity from '@/models/Opportunity';
import Config from '@/models/Config';
import OportunidadesClient from './OportunidadesClient';
import styles from './OportunidadesPublic.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Editais, Vagas e Oportunidades - ABN',
  description: 'Descubra editais de fomento, concursos de pitching, financiamentos de impacto, bolsas de estudo, programas de aceleração e vagas abertas no ecossistema.',
};

export default async function PublicOportunidadesPage() {
  await dbConnect();
  
  const bannerConfig = await Config.findOne({ key: 'page_banners' }).lean();
  const bannerUrl = bannerConfig?.value?.oportunidades || '/articles/nilza.png';

  const rawOpportunities = await Opportunity.find({}).sort({ deadline: 1 }).lean();

  const serializedOpportunities = rawOpportunities.map((opp: any) => ({
    _id: opp._id.toString(),
    title: opp.title,
    amount: opp.amount,
    deadline: opp.deadline ? opp.deadline.toISOString() : new Date().toISOString(),
    category: opp.category,
    description: opp.description,
    applyLink: opp.applyLink || '',
    location: opp.location || '',
    provider: opp.provider || ''
  }));

  return (
    <main className={styles.oportunidadesPage}>
      <Navbar />

      <header className={styles.hero} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(10, 10, 10, 0.95) 100%), url('${bannerUrl}')` }}>
        <div className={styles.container}>
          <h1 className="text-gradient-gold">Oportunidades de Crescimento</h1>
          <p>
            Encontre editais abertos, bolsas de capacitação, financiamentos de impacto, concursos de startups, programas e vagas de trabalho no ecossistema.
          </p>
        </div>
      </header>

      <section style={{ paddingBottom: '4rem' }}>
        <div className={styles.container}>
          <OportunidadesClient initialOpportunities={serializedOpportunities} />
        </div>
      </section>
    </main>
  );
}
