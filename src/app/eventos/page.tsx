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
        endDate: '2026-11-22',
        location: 'Maputo, Moçambique',
        type: 'upcoming',
        category: 'Summit ABN',
        imageUrl: '/articles/gala.png',
        link: 'https://sympla.com.br',
        program: [
          { time: '09:00', title: 'Abertura Oficial', speaker: 'Administrador ABN', description: 'Cerimónia de abertura do Summit ABN 2026' },
          { time: '10:00', title: 'Painel: Investimento em África', speaker: 'Convidados Internacionais', description: 'Discussão sobre oportunidades de investimento em startups africanas' },
          { time: '14:00', title: 'Sessões de Pitch', speaker: 'Startups Selecionadas', description: 'Apresentação de startups a investidores' }
        ],
        speakers: [
          { name: 'Dr. Amadou Diallo', role: 'Investidor', company: 'Africa Ventures', photo: '', bio: 'Especialista em investimento em startups africanas' },
          { name: 'Sarah Mensah', role: 'Estrategista', company: 'Global Strategy', photo: '', bio: 'Consultora estratégica para empresas africanas' }
        ],
        countries: ['Moçambique', 'Angola', 'Guiné-Bissau', 'São Tomé e Príncipe', 'Cabo Verde'],
        tickets: [
          { type: 'empreendedor', name: 'Bilhete Standard', price: 5000, currency: 'MT', description: 'Acesso a todas as sessões', benefits: ['Coffee break', 'Material do evento'], available: 100, includes: ['Acesso ao networking'] },
          { type: 'empresa', name: 'VIP Empresarial', price: 25000, currency: 'MT', description: 'Acesso VIP para 5 pessoas', benefits: ['Lugar VIP', 'Logo no site', 'Sessões exclusivas'], available: 20, includes: ['Jantar exclusivo', 'Mesa redonda'] }
        ],
        sponsorshipPackages: [
          { name: 'Bronze', price: 100000, currency: 'MT', description: 'Patrocínio bronze', benefits: ['Logo no site', 'Menção nos materiais'], visibility: ['Banner no site'], includes: ['2 bilhetes'] },
          { name: 'Prata', price: 250000, currency: 'MT', description: 'Patrocínio prata', benefits: ['Logo em destaque', 'Banner no site', 'Mesa redonda'], visibility: ['Banner topo', 'Menção em newsletter'], includes: ['5 bilhetes', 'Stand'] },
          { name: 'Ouro', price: 500000, currency: 'MT', description: 'Patrocínio ouro', benefits: ['Logo premium', 'Banner destaque', 'Sessão plenária', 'Jantar exclusivo'], visibility: ['Banner homepage', 'Mesa redonda principal', 'Sessão plenária'], includes: ['10 bilhetes', 'Stand premium', 'Sessão plenária'] }
        ],
        sponsors: [
          { name: 'Banco ABC', logo: '', level: 'gold', website: 'https://abc.co.mz' },
          { name: 'Tech Ventures', logo: '', level: 'silver', website: 'https://techventures.com' }
        ]
      },
      {
        title: 'Conferência de Finanças para Startups',
        description: 'Painéis e workshops com especialistas financeiros, investidores e representantes de bancos de fomento focados em captação de investimento inicial, estruturação de propostas e compliance regulatório africano.',
        date: '2026-09-05',
        location: 'Online (Zoom)',
        type: 'upcoming',
        category: 'Conferência',
        imageUrl: '/articles/ambassador-day.png',
        link: 'https://zoom.us',
        program: [
          { time: '10:00', title: 'Abertura', speaker: 'Organizador', description: 'Boas-vindas e introdução ao tema' },
          { time: '11:00', title: 'Workshop: Estruturação de Propostas', speaker: 'Especialista Financeiro', description: 'Como estruturar propostas de investimento' }
        ],
        speakers: [
          { name: 'Kofi Annan Jr.', role: 'Finanças', company: 'Bank ABC', photo: '', bio: 'Especialista em finanças corporativas' }
        ],
        countries: ['Moçambique', 'Angola'],
        tickets: [
          { type: 'empreendedor', name: 'Bilhete Online', price: 2000, currency: 'MT', description: 'Acesso à conferência online', benefits: ['Acesso às gravações'], available: 0, includes: ['Certificado digital'] }
        ],
        sponsorshipPackages: [],
        sponsors: []
      },
      {
        title: 'Missão Empresarial ABN - África do Sul',
        description: 'Uma delegação de empreendedores moçambicanos visitará os principais polos de tecnologia e inovação em Joanesburgo e Cidade do Cabo, com foco em benchmarking e facilitação de parcerias com corporações regionais.',
        date: '2026-10-12',
        endDate: '2026-10-15',
        location: 'Joanesburgo, África do Sul',
        type: 'upcoming',
        category: 'Missão Empresarial',
        imageUrl: '/articles/nilza.png',
        link: '',
        program: [
          { time: '08:00', title: 'Partida', speaker: '', description: 'Partida de Maputo' },
          { time: '14:00', title: 'Chegada', speaker: '', description: 'Chegada a Joanesburgo' }
        ],
        speakers: [],
        countries: ['Moçambique'],
        tickets: [
          { type: 'empresa', name: 'Participação na Missão', price: 150000, currency: 'MT', description: 'Participação completa na missão', benefits: ['Voo, hotel, visitas'], available: 10, includes: ['Seguro', 'Visitas técnicas'] }
        ],
        sponsorshipPackages: [],
        sponsors: []
      },
      {
        title: 'Feira de Negócios & Exposição ABN 2025',
        description: 'Exposição anual que conectou dezenas de startups incubadas, pequenas empresas locais e corporações parceiras em rodadas dinâmicas de matchmaking empresarial e negócios diretos.',
        date: '2025-11-15',
        location: 'Maputo, Moçambique',
        type: 'past',
        category: 'Feira',
        imageUrl: '/articles/gala.png',
        link: '',
        program: [],
        speakers: [],
        countries: ['Moçambique'],
        tickets: [],
        sponsorshipPackages: [],
        sponsors: []
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
    endDate: e.endDate || '',
    location: e.location,
    type: e.type,
    category: e.category,
    imageUrl: e.imageUrl || '',
    link: e.link || '',
    program: e.program || [],
    speakers: e.speakers || [],
    countries: e.countries || [],
    tickets: e.tickets || [],
    sponsorshipPackages: e.sponsorshipPackages || [],
    sponsors: e.sponsors || []
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
