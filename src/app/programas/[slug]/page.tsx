import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const programDetails: Record<string, { title: string; description: string; icon: string }> = {
  'startup-180': {
    title: 'ABN Startup 180',
    description: 'Programa de incubação intensiva de 180 dias para startups em fase inicial. Oferecemos mentoria estratégica, acesso a investidores e ferramentas para escalar o seu negócio.',
    icon: '🚀'
  },
  'clube-empreendedores': {
    title: 'Clube dos Empreendedores',
    description: 'Comunidade exclusiva para networking, mentoria e oportunidades de negócios. Conecte-se com outros empreendedores, especialistas e investidores do ecossistema ABN.',
    icon: '🤝'
  },
  'clubes-startups-mocambique': {
    title: 'Clubes das Startups (Moçambique)',
    description: 'Hubs locais de apoio a startups em Maputo e outras cidades moçambicanas. Espaços físicos e virtuais para conectar empreendedores locais.',
    icon: '🏢'
  },
  'clubes-startups-angola': {
    title: 'Clubes das Startups (Angola)',
    description: 'Hubs locais de apoio a startups em Luanda e outras cidades angolanas. Espaços físicos e virtuais para conectar empreendedores locais.',
    icon: '🏢'
  },
  'mentalidade-empreendedora': {
    title: 'Mentalidade Empreendedora',
    description: 'Formação em mindset e soft skills para empreendedores em crescimento. Desenvolva as competências necessárias para liderar negócios de sucesso.',
    icon: '🧠'
  }
};

export default function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const program = programDetails[params.slug || '']];

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
        <div className={styles.header}>
          <div className={styles.icon}>{program.icon}</div>
          <h1>{program.title}</h1>
          <p>{program.description}</p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h2>Sobre o Programa</h2>
            <p>Informações detalhadas sobre {program.title} serão disponibilizadas brevemente pela direção da ABN.</p>
          </div>

          <div className={styles.section}>
            <h2>Como Participar</h2>
            <p>As candidaturas para {program.title} serão abertas brevemente. Fique atento às nossas redes sociais e página de oportunidades.</p>
          </div>

          <div className={styles.cta}>
            <a href="/contacto" className={styles.btn}>Entrar em Contacto</a>
            <a href="/programas" className={styles.btnSecondary}>Voltar para Programas</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}