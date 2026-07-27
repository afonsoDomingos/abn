import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/mongodb';
import Program from '@/models/Program';
import Config from '@/models/Config';
import ProgramsList from './ProgramsList';
import styles from './Incubacao.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Programas de Incubação e Aceleração (Spark & Scale)',
  description: 'Valide, acelere e scale o seu modelo de negócio ou startup em África com mentorias estratégicas, suporte de marketing e conexão a investidores.',
};

const defaultPrograms = [
  {
    title: 'ABN STARTUP 180',
    description: 'O ABN Startup 180 é o programa de incubação, desenvolvimento e aceleração de Negócios da Afrobiz Network (ABN).\n\nO programa foi concebido para apoiar empreendedores desde a fase da ideia até ao crescimento sustentável do negócio, através de formação, mentoria, networking, acompanhamento técnico e acesso a oportunidades.\n\nO ABN Startup 180 integra diferentes iniciativas que trabalham de forma articulada para fortalecer o ecossistema empreendedor.',
    publicoAlvo: '- Empreendedores com ideias de negócio;\n- Startups em fase inicial;\n- Pequenas e médias empresas;\n- Estudantes empreendedores;\n- Jovens e mulheres empreendedoras;\n- Negócios informais em processo de formalização.',
    beneficios: '',
    requisitos: '',
    investimento: '',
    processoSelecao: '',
    criteriosSelecao: '',
    phase: 'Incubação & Aceleração',
    duration: 'Contínuo',
    status: 'ativo',
    order: 0
  },
  {
    title: 'MENTALIDADE EMPREENDEDORA',
    description: 'A Mentalidade Empreendedora é uma iniciativa do ABN Startup 180 dedicada ao desenvolvimento das competências pessoais e profissionais necessárias para criar, gerir e expandir um negócio.\n\nO programa aborda temas como liderança, inovação, gestão, vendas, marketing, finanças, negociação, inteligência emocional, comunicação e desenvolvimento pessoal.',
    publicoAlvo: '',
    beneficios: '- Formação prática;\n- Certificado de participação;\n- Networking;\n- Mentoria;\n- Acesso às atividades da ABN.',
    requisitos: '- Ter idade igual ou superior a 16 anos;\n- Interesse em empreendedorismo;\n- Compromisso com a aprendizagem.',
    investimento: 'Inscrição: Gratuita\nFormação: Conforme cada edição (algumas edições poderão ser patrocinadas ou totalmente gratuitas).',
    processoSelecao: '',
    criteriosSelecao: '',
    phase: 'Desenvolvimento',
    duration: 'Por Edição',
    status: 'ativo',
    order: 1
  },
  {
    title: 'A VOZ DO EMPREENDEDOR',
    description: 'A Voz do Empreendedor é a plataforma oficial da ABN para dar visibilidade aos empreendedores, às suas histórias, produtos, serviços e impacto na sociedade.\n\nA iniciativa promove entrevistas, reportagens, podcasts, vídeos, artigos e conteúdos digitais.',
    publicoAlvo: '',
    beneficios: '- Divulgação do negócio;\n- Fortalecimento da marca;\n- Networking;\n- Maior visibilidade.',
    requisitos: '- Possuir um negócio ou projeto empreendedor;\n- Disponibilidade para entrevista ou gravação;\n- Autorizar a divulgação dos conteúdos.',
    investimento: 'Participação básica: Gratuita\nProduções especiais: Sob orçamento.',
    processoSelecao: '',
    criteriosSelecao: '',
    phase: 'Visibilidade & Media',
    duration: 'Sob Demanda',
    status: 'ativo',
    order: 2
  },
  {
    title: 'ROTA DE EMPREENDEDORES',
    description: 'A Rota de Empreendedores é uma iniciativa de aproximação da ABN aos empreendedores.\n\nAtravés de visitas técnicas, a equipa conhece negócios, identifica desafios, oportunidades e talentos para integrar o ABN Startup 180.',
    publicoAlvo: '',
    beneficios: '- Diagnóstico empresarial;\n- Identificação de oportunidades;\n- Encaminhamento para incubação;\n- Networking.',
    requisitos: '- Possuir um negócio ou iniciativa empreendedora;\n- Aceitar receber a equipa da ABN.',
    investimento: 'Visitas institucionais: Gratuito\nDiagnósticos especializados: Conforme tabela de serviços da ABN.',
    processoSelecao: '',
    criteriosSelecao: '',
    phase: 'Diagnóstico',
    duration: 'Visitas Agendadas',
    status: 'ativo',
    order: 3
  },
  {
    title: 'CLUBE DOS EMPREENDEDORES',
    description: 'O Clube dos Empreendedores é a comunidade oficial de networking da ABN.\n\nReúne empreendedores para partilha de experiências, parcerias, oportunidades de negócio, eventos exclusivos e desenvolvimento contínuo.',
    publicoAlvo: '',
    beneficios: '- Networking;\n- Eventos exclusivos;\n- Divulgação de oportunidades;\n- Acesso prioritário às iniciativas da ABN;\n- Comunidade empresarial.',
    requisitos: '- Ser empreendedor ou fundador de um negócio;\n- Respeitar o regulamento do Clube;\n- Participar nas actividades.',
    investimento: 'Plano Individual:\n- Inscrição: 500 MT\n- Mensalidade: 300 MT\n\nPlano Empresarial:\n- Sob consulta.',
    processoSelecao: '',
    criteriosSelecao: '',
    phase: 'Networking',
    duration: 'Membro Contínuo',
    status: 'ativo',
    order: 4
  },
  {
    title: 'INCUBAÇÃO ABN STARTUP 180',
    description: 'Os empreendedores selecionados terão acesso a um ecossistema completo de desenvolvimento empresarial estruturado pela Afrobiz Network.',
    publicoAlvo: '',
    beneficios: '- Diagnóstico do negócio;\n- Plano de desenvolvimento;\n- Mentoria especializada;\n- Formação contínua;\n- Networking;\n- Preparação para investimento;\n- Desenvolvimento do modelo de negócio;\n- Ligação a parceiros nacionais e internacionais;\n- Certificação.',
    requisitos: '',
    investimento: 'Gratuito para startups selecionadas.',
    processoSelecao: 'A seleção pode ocorrer através de:\n- Formulário oficial;\n- Rota de Empreendedores;\n- A Voz do Empreendedor;\n- Clube dos Empreendedores;\n- Eventos promovidos pela ABN;\n- Parceiros institucionais.',
    criteriosSelecao: '- Potencial de impacto;\n- Grau de inovação;\n- Compromisso do empreendedor;\n- Viabilidade do negócio;\n- Interesse em participar nas atividades do programa.',
    phase: 'Incubação',
    duration: '6 a 12 Meses',
    status: 'ativo',
    order: 5
  }
];

const criteriaItems = [
  {
    icon: '🇲🇿',
    title: 'Residência & Nacionalidade',
    desc: 'Todos os jovens moçambicanos e/ou residentes em Maputo.'
  },
  {
    icon: '📅',
    title: 'Faixa Etária',
    desc: 'Com idades compreendidas entre os 18 aos 60 anos.'
  },
  {
    icon: '🎓',
    title: 'Perfil Académico',
    desc: 'Estudantes finalistas e recém graduados (licenciatura ou mestrado).'
  },
  {
    icon: '💡',
    title: 'Conceito de Negócio',
    desc: 'Possuidores de uma ideia de negócio, projecto para concretizar, ou start-up na fase nascente com menos de 2 anos (formalizada ou não).'
  },
  {
    icon: '🚀',
    title: 'Inovação & Potencial',
    desc: 'Conceitos com inovação, impacto, equipa talentosa, exequibilidade, e um encaixe claro entre o problema identificado e a solução.'
  },
  {
    icon: '🤝',
    title: 'Perfil do Candidato',
    desc: 'Candidatos com abertura para feedback, curiosidade, responsabilidade, compromisso, motivação e disponibilidade total.'
  }
];

const mentors = [
  { name: 'Dr. Amadou Diallo', role: 'Especialista em Finanças', img: '/Perfil01.jpg' },
  { name: 'Sarah Mensah', role: 'Estrategia de Marketing', img: '/Perfil02.jpg' },
  { name: 'Kofi Annan Jr.', role: 'Desenvolvimento de Negócios', img: '/Perfil04.jpg' }
];

export default async function Incubacao() {
  await dbConnect();
  
  const bannerConfig = await Config.findOne({ key: 'page_banners' }).lean();
  const bannerUrl = bannerConfig?.value?.incubacao || '/hero_entrepreneurs.png';

  let dbPrograms = await Program.find({}).sort({ order: 1, createdAt: 1 }).lean();

  // If database is empty, seed the default programs
  if (dbPrograms.length === 0) {
    const createdPrograms = await Program.create(defaultPrograms);
    // Convert Mongoose documents back to lean objects
    dbPrograms = createdPrograms.map((p: any) => p.toObject());
  }

  // Serialize MongoDB ObjectId and Date properties to strings for client components
  const serializedPrograms = dbPrograms.map((p: any) => ({
    _id: p._id.toString(),
    title: p.title,
    description: p.description,
    publicoAlvo: p.publicoAlvo || '',
    beneficios: p.beneficios || '',
    requisitos: p.requisitos || '',
    investimento: p.investimento || '',
    processoSelecao: p.processoSelecao || '',
    criteriosSelecao: p.criteriosSelecao || '',
    phase: p.phase || '',
    duration: p.duration || '',
    image: p.image || '',
    status: p.status || 'ativo',
    order: p.order || 0
  }));

  return (
    <main className={styles.incubacaoPage}>
      <Navbar />
      
      <header className={styles.header} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(10, 10, 10, 0.95) 100%), url('${bannerUrl}')` }}>
        <div className={styles.container}>
          <h1 className="text-gradient-gold">Área de Incubação</h1>
          <p>Transformamos ideias em negócios sustentáveis com impacto real em África.</p>
        </div>
      </header>

      <section className={styles.programs}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nossos Programas</h2>
          <ProgramsList initialPrograms={serializedPrograms} />
        </div>
      </section>

      {/* Selection Criteria Section */}
      <section className={styles.criteria}>
        <div className={styles.container}>
          <h2 className={styles.criteriaTitle}>Critérios de Seleção</h2>
          <p className={styles.criteriaSubtitle}>
            Poderão candidatar-se aos nossos programas os candidatos que reúnam as seguintes condições:
          </p>
          <div className={styles.criteriaGrid}>
            {criteriaItems.map((item, idx) => (
              <div key={idx} className={styles.criteriaCard}>
                <div className={styles.criteriaIcon}>
                  {item.icon}
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.mentors}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Mentores em Destaque</h2>
          <div className={styles.mentorGrid}>
            {mentors.map((m, i) => (
              <div key={i} className={`${styles.mentorCard} glass`}>
                <div 
                  className={styles.mentorAvatar} 
                  style={{ backgroundImage: `url(${m.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                ></div>
                <h4>{m.name}</h4>
                <p>{m.role}</p>
                <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Ver Perfil</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
