import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import Config from '@/models/Config';
import EventosClient from './EventosClient';
import styles from './EventosPublic.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Eventos - AfroBiz Network (ABN)',
  description: 'Acompanhe as conferências, feiras, missões empresariais e summits promovidos pela Afrobiz Network para impulsionar negócios em África.',
};

export default async function EventosPage() {
  await dbConnect();
  
  const bannerConfig = await Config.findOne({ key: 'page_banners' }).lean();
  const bannerUrl = bannerConfig?.value?.eventos || '/articles/gala.png';

  const rawEvents = await Event.find({}).sort({ date: 1, createdAt: 1 }).lean();

  // Seeding default events directly in Server Component if DB is empty
  let dbEvents = rawEvents;
  if (rawEvents.length === 0) {
    const createdEvents = await Event.create([
      {
        title: 'Summit ABN 2026 - Conectando África',
        description: 'O maior evento anual de inovação e aceleração de negócios da Afrobiz Network, reunindo investidores globais, startups de impacto e decisores políticos em uma jornada repleta de painéis inspiradores, sessões de pitch e oportunidades de networking incomparáveis.',
        date: '2026-11-20',
        location: 'Maputo, Moçambique',
        type: 'upcoming',
        category: 'Summit ABN',
        imageUrl: '/articles/gala.png',
        link: 'https://sympla.com.br'
      },
      {
        title: 'Conferência de Finanças para Startups',
        description: 'Painéis e workshops com especialistas financeiros, investidores e representantes de bancos de fomento focados em captação de investimento inicial, estruturação de propostas e compliance regulatório africano.',
        date: '2026-09-05',
        location: 'Online (Zoom)',
        type: 'upcoming',
        category: 'Conferência',
        imageUrl: '/articles/ambassador-day.png',
        link: 'https://zoom.us'
      },
      {
        title: 'Missão Empresarial ABN - África do Sul',
        description: 'Uma delegação de empreendedores moçambicanos visitará os principais polos de tecnologia e inovação em Joanesburgo e Cidade do Cabo, com foco em benchmarking e facilitação de parcerias com corporações regionais.',
        date: '2026-10-12',
        location: 'Joanesburgo, África do Sul',
        type: 'upcoming',
        category: 'Missão Empresarial',
        imageUrl: '/articles/nilza.png',
        link: ''
      },
      {
        title: 'Feira de Negócios & Exposição ABN 2025',
        description: 'Exposição anual que conectou dezenas de startups incubadas, pequenas empresas locais e corporações parceiras em rodadas dinâmicas de matchmaking empresarial e negócios diretos.',
        date: '2025-11-15',
        location: 'Maputo, Moçambique',
        type: 'past',
        category: 'Feira',
        imageUrl: '/articles/gala.png',
        link: ''
      }
    ]);
    dbEvents = createdEvents.map((e: any) => e.toObject());
  }

  // Serialize MongoDB ObjectId and Date properties to strings for client components
  const serializedEvents = dbEvents.map((e: any) => ({
    _id: e._id.toString(),
    title: e.title,
    description: e.description,
    date: e.date,
    location: e.location,
    type: e.type,
    category: e.category,
    imageUrl: e.imageUrl || '',
    link: e.link || ''
  }));

  return (
    <main className={styles.eventosPage}>
      <Navbar />
      
      <header className={styles.hero} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(10, 10, 10, 0.95) 100%), url('${bannerUrl}')` }}>
        <div className={styles.container}>
          <h1 className="text-gradient-gold">Eventos ABN</h1>
          <p>
            Participe em conferências, feiras, missões empresariais e summits desenhados para conectar o ecossistema e acelerar o desenvolvimento de negócios.
          </p>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.container}>
          <EventosClient initialEvents={serializedEvents} />
        </div>
      </section>
    </main>
  );
}
