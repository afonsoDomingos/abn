'use client';

import { useEffect, useState } from 'react';
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
  image?: string;
  investimento?: string;
  price?: string;
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

function isFreeProgram(program: Program): boolean {
  const investment = program.investimento?.toLowerCase() || '';
  const price = program.price?.toLowerCase() || '';
  return investment.includes('gratuito') || investment.includes('grátis') || price === '' || price === '0' || price === '0 mt';
}

export default function ProgramasPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const baseUrl = window.location.origin;
        const res = await fetch(`${baseUrl}/api/programs`);
        if (!res.ok) {
          console.error('API response not OK:', res.status, res.statusText);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.success && data.programs) {
          setPrograms(data.programs.filter((p: Program) => !p.status || p.status === 'ativo'));
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching programs:', err);
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.header}>
            <h1>Programas ABN</h1>
            <p>Programas de incubação, aceleração e capacitação para empreendedores africanos.</p>
          </div>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Carregando programas...</p>
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
          <h1>Programas ABN</h1>
          <p>Programas de incubação, aceleração e capacitação para empreendedores africanos.</p>
        </div>

        <div className={styles.programsGrid}>
          {programs.length === 0 ? (
            <p className={styles.noPrograms}>Nenhum programa disponível no momento.</p>
          ) : (
            programs.map((program) => {
              const icon = getProgramIcon(program.title);
              const color = getProgramColor(program.title);
              const slug = getProgramSlug(program.title);
              const shortDescription = program.description.split('\n')[0] || program.description;
              const isFree = isFreeProgram(program);

              return (
                <div key={program._id} className={styles.programCard}>
                  {program.image && (
                    <div className={styles.programImage}>
                      <img
                        src={program.image}
                        alt={program.title}
                        className={styles.programImg}
                      />
                      <div className={`${styles.priceBadge} ${isFree ? styles.freeBadge : styles.paidBadge}`}>
                        {isFree ? 'Gratuito' : 'Pago'}
                      </div>
                    </div>
                  )}
                  <div className={styles.programContent}>
                    <div className={styles.programIcon} style={{ color }}>{icon}</div>
                    <h2>{program.title}</h2>
                    <p>{shortDescription}</p>
                    <a href={`/programas/${slug}`} className={styles.btn} style={{ background: color }}>
                      Saber mais
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}