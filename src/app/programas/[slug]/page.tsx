import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Rocket, Users, Building2, Brain, ArrowRight } from 'lucide-react';
import styles from './page.module.css';

const programDetails: Record<string, { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  duration: string;
  benefits: string[];
  requirements: string[];
  color: string;
}> = {
  'startup-180': {
    title: 'ABN Startup 180',
    description: 'Programa de incubação intensiva de 180 dias para startups em fase inicial. Oferecemos mentoria estratégica, acesso a investidores e ferramentas para escalar o seu negócio.',
    icon: <Rocket size={48} />,
    duration: '180 dias',
    benefits: [
      'Mentoria individual com especialistas',
      'Acesso a rede de investidores',
      'Workshops semanais de capacitação',
      'Validação de modelo de negócio',
      'Networking com startups parceiras',
      'Acesso a recursos e ferramentas'
    ],
    requirements: [
      'Startup em fase inicial (até 3 anos)',
      'Produto mínimo viável (MVP)',
      'Equipa fundacional completa',
      'Disponibilidade para participar dos workshops',
      'Vontade de aprender e crescer'
    ],
    color: '#ff6b00'
  },
  'clube-empreendedores': {
    title: 'Clube dos Empreendedores',
    description: 'Comunidade exclusiva para networking, mentoria e oportunidades de negócios. Conecte-se com outros empreendedores, especialistas e investidores do ecossistema ABN.',
    icon: <Users size={48} />,
    duration: 'Anual',
    benefits: [
      'Networking mensal com outros empreendedores',
      'Mentoria com especialistas do setor',
      'Acesso a oportunidades de negócios',
      'Eventos exclusivos para membros',
      'Descontos em cursos e serviços',
      'Visibilidade na plataforma ABN'
    ],
    requirements: [
      'Negócio ativo ou ideia validada',
      'Compromisso com networking ativo',
      'Disponibilidade para participar de eventos',
      'Vontade de contribuir para o ecossistema'
    ],
    color: '#3b82f6'
  },
  'clubes-startups-mocambique': {
    title: 'Clubes das Startups (Moçambique)',
    description: 'Hubs locais de apoio a startups em Maputo e outras cidades moçambicanas. Espaços físicos e virtuais para conectar empreendedores locais.',
    icon: <Building2 size={48} />,
    duration: 'Contínuo',
    benefits: [
      'Espaço físico de trabalho',
      'Conexões locais com mentores',
      'Eventos de networking locais',
      'Acesso a recursos locais',
      'Integração com ecossistema moçambicano',
      'Visibilidade na comunidade local'
    ],
    requirements: [
      'Startup baseada em Moçambique',
      'Disponibilidade para usar o espaço',
      'Participação em eventos locais',
      'Interesse em contribuir para o ecossistema local'
    ],
    color: '#10b981'
  },
  'clubes-startups-angola': {
    title: 'Clubes das Startups (Angola)',
    description: 'Hubs locais de apoio a startups em Luanda e outras cidades angolanas. Espaços físicos e virtuais para conectar empreendedores locais.',
    icon: <Building2 size={48} />,
    duration: 'Contínuo',
    benefits: [
      'Espaço físico de trabalho',
      'Conexões locais com mentores',
      'Eventos de networking locais',
      'Acesso a recursos locais',
      'Integração com ecossistema angolano',
      'Visibilidade na comunidade local'
    ],
    requirements: [
      'Startup baseada em Angola',
      'Disponibilidade para usar o espaço',
      'Participação em eventos locais',
      'Interesse em contribuir para o ecossistema local'
    ],
    color: '#f59e0b'
  },
  'mentalidade-empreendedora': {
    title: 'Mentalidade Empreendedora',
    description: 'Formação em mindset e soft skills para empreendedores em crescimento. Desenvolva as competências necessárias para liderar negócios de sucesso.',
    icon: <Brain size={48} />,
    duration: '8 semanas',
    benefits: [
      'Desenvolvimento de mindset empreendedor',
      'Competências de liderança',
      'Gestão de tempo e produtividade',
      'Comunicação eficaz',
      'Resiliência e gestão de stress',
      'Networking com outros empreendedores'
    ],
    requirements: [
      'Interesse em desenvolver competências empreendedoras',
      'Disponibilidade para as sessões',
      'Compromisso com o auto-desenvolvimento',
      'Vontade de aplicar aprendizados no negócio'
    ],
    color: '#8b5cf6'
  }
};

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = programDetails[slug || ''];

  if (!program) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.error}>
            <h1>Programa não encontrado</h1>
            <p>O programa que procura não existe ou foi movido.</p>
            <a href="/programas" className={styles.btn}>Voltar para Programas</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.container}>
        {/* Hero Section */}
        <div className={styles.hero} style={{ background: `linear-gradient(135deg, ${program.color} 0%, ${program.color}dd 100%)` }}>
          <div className={styles.heroContent}>
            <div className={styles.heroIcon} style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              {program.icon}
            </div>
            <h1>{program.title}</h1>
            <p>{program.description}</p>
            <div className={styles.heroMeta}>
              <span className={styles.durationBadge}>
                <ArrowRight size={16} style={{ marginRight: '8px' }} />
                {program.duration}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {/* Benefits Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Benefícios</h2>
            <div className={styles.benefitsGrid}>
              {program.benefits.map((benefit, i) => (
                <div key={i} className={styles.benefitItem}>
                  <div className={styles.benefitIcon} style={{ color: program.color }}>✓</div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Requisitos</h2>
            <div className={styles.requirementsList}>
              {program.requirements.map((req, i) => (
                <div key={i} className={styles.requirementItem}>
                  <span className={styles.requirementNumber}>{i + 1}</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className={styles.cta}>
            <a href="/contacto" className={styles.btn} style={{ background: program.color }}>
              Entrar em Contacto
            </a>
            <a href="/programas" className={styles.btnSecondary}>
              Voltar para Programas
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}