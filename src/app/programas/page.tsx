import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Rocket, Users, Building2, Brain, Megaphone, MapPin } from 'lucide-react';
import styles from './page.module.css';

interface Program {
  _id: string;
  title: string;
  description: string;
  duration: string;
  phase: string;
  status: string;
}

async function getPrograms(): Promise<Program[]> {
  try {
    const res = await fetch('/api/programs', {
      cache: 'no-store'
    });
    const data = await res.json();

    if (data.success && data.programs) {
      return data.programs.filter((p: Program) => !p.status || p.status === 'ativo');
    }
    return [];
  } catch (error) {
    return [];
  }
}

function getProgramIcon(title: string): React.ReactNode {
  const t = title.toLowerCase();
  if (t.includes('startup') || t.includes('incubação')) return <Rocket size={48} />;
  if (t.includes('clube')) return <Users size={48} />;
  if (t.includes('mentalidade')) return <Brain size={48} />;
  if (t.includes('voz')) return <Megaphone size={48} />;
  if (t.includes('rota')) return <MapPin size={48} />;
  return <Rocket size={48} />;
}

function getProgramColor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('startup') || t.includes('incubação')) return '#ff6b00';
  if (t.includes('clube')) return '#3b82f6';
  if (t.includes('mentalidade')) return '#8b5cf6';
  if (t.includes('voz')) return '#10b981';
  if (t.includes('rota')) return '#f59e0b';
  return '#ff6b00';
}

function getProgramSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export default async function ProgramasPage() {
  const programs = await getPrograms();

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.container}>
        <div className={styles.header}>
          <h1>Programas ABN</h1>
          <p>Programas de incubação, aceleração e capacitação para empreendedores africanos.</p>
        </div>

        <div className={styles.programsGrid}>
          {programs.map((program) => {
            const icon = getProgramIcon(program.title);
            const color = getProgramColor(program.title);
            const slug = getProgramSlug(program.title);
            const shortDescription = program.description.split('\n')[0] || program.description;
            
            return (
              <div key={program._id} className={styles.programCard}>
                <div className={styles.programIcon} style={{ color }}>{icon}</div>
                <h2>{program.title}</h2>
                <p>{shortDescription}</p>
                <a href={`/programas/${slug}`} className={styles.btn} style={{ background: color }}>
                  Saber mais
                </a>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}