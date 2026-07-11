import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import styles from './Incubacao.module.css';

export const metadata: Metadata = {
  title: 'Programas de Incubação e Aceleração (Spark & Scale)',
  description: 'Valide, acelere e scale o seu modelo de negócio ou startup em África com mentorias estratégicas, suporte de marketing e conexão a investidores.',
};

const programs = [
  {
    title: 'ABN Spark',
    phase: 'Ideação',
    duration: '8 Semanas',
    description: 'Para quem tem uma ideia mas não sabe por onde começar. Validamos o seu modelo de negócio.'
  },
  {
    title: 'ABN Scale',
    phase: 'Crescimento',
    duration: '6 Meses',
    description: 'Para startups com tração que procuram escalar operações e aceder a investimento.'
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

export default function Incubacao() {
  return (
    <main className={styles.incubacaoPage}>
      <Navbar />
      
      <header className={styles.header}>
        <div className={styles.container}>
          <h1 className="text-gradient-gold">Área de Incubação</h1>
          <p>Transformamos ideias em negócios sustentáveis com impacto real em África.</p>
        </div>
      </header>

      <section className={styles.programs}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nossos Programas</h2>
          <div className={styles.grid}>
            {programs.map((p, i) => (
              <div key={i} className={`${styles.programCard} glass`}>
                <div className={styles.cardHeader}>
                  <h3>{p.title}</h3>
                  <span className={styles.phaseBadge}>{p.phase}</span>
                </div>
                <p className={styles.desc}>{p.description}</p>
                <div className={styles.meta}>
                  <span>⏱ {p.duration}</span>
                  <button className="btn-primary">Candidatar-se</button>
                </div>
              </div>
            ))}
          </div>
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
