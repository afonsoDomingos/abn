'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import Link from 'next/link';
import styles from './Programas.module.css';

interface Program {
  _id: string;
  title: string;
  description: string;
  publicoAlvo?: string;
  beneficios?: string;
  requisitos?: string;
  investimento?: string;
  processoSelecao?: string;
  criteriosSelecao?: string;
  phase?: string;
  duration?: string;
  status: string;
  order: number;
  // Club specific fields
  missao?: string;
  visao?: string;
  valores?: string;
  objectivos?: string;
  areasActuacao?: string;
  actividades?: string;
  beneficiosMembros?: string;
  compromissoMembros?: string;
  lema?: string;
  isClub?: boolean;
  province?: string;
}

export default function ProgramasPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState('/hero_entrepreneurs.png');

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.programs) setPrograms(data.programs.filter((p: Program) => p.status === 'ativo'));
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.page_banners?.programas) {
          setBannerUrl(data.configs.page_banners.programas);
        }
      })
      .catch(() => {});
  }, []);

  const phaseColors: Record<string, { color: string; bg: string }> = {
    'Incubação & Aceleração': { color: '#d4af37', bg: 'rgba(212,175,55,0.1)' },
    'Desenvolvimento': { color: '#3498db', bg: 'rgba(52,152,219,0.1)' },
    'Formação': { color: '#2ecc71', bg: 'rgba(46,204,113,0.1)' },
    'Networking': { color: '#e67e22', bg: 'rgba(230,126,34,0.1)' },
  };

  const getPhaseStyle = (phase?: string) =>
    phaseColors[phase || ''] || { color: 'var(--primary)', bg: 'rgba(212,175,55,0.1)' };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Hero */}
        <header
          className={styles.hero}
          style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(10,10,10,0.95) 100%), url('${bannerUrl}')` }}
        >
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>🚀 Nossos Programas</span>
            <h1>Programas de Incubação &amp; Aceleração</h1>
            <p>
              Descubra os programas da ABN desenhados para transformar ideias em negócios de impacto em África.
            </p>
            <Link href="/incubacao" className={styles.heroBtn}>
              Ver Incubação &amp; Aceleração
            </Link>
          </div>
        </header>

        {/* Programs list */}
        <section className={styles.section}>
          <div className={styles.container}>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>A carregar programas...</p>
              </div>
            ) : programs.length === 0 ? (
              <div className={styles.empty}>
                <span style={{ fontSize: '3rem' }}>📋</span>
                <p>Nenhum programa disponível de momento.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {programs.map(prog => {
                  const { color, bg } = getPhaseStyle(prog.phase);
                  const isOpen = expanded === prog._id;
                  return (
                    <div key={prog._id} className={`${styles.card} ${isOpen ? styles.cardOpen : ''}`}>
                      <div className={styles.cardTop}>
                        <div className={styles.cardMeta}>
                          {prog.isClub && (
                            <span className={styles.phaseBadge} style={{ color: '#d4af37', background: 'rgba(212,175,55,0.1)' }}>
                              🏛️ Clube de Empreendedores
                            </span>
                          )}
                          {prog.isClub && prog.province && (
                            <span className={styles.durationBadge}>📍 {prog.province}</span>
                          )}
                          {!prog.isClub && prog.phase && (
                            <span className={styles.phaseBadge} style={{ color, background: bg }}>
                              {prog.phase}
                            </span>
                          )}
                          {!prog.isClub && prog.duration && (
                            <span className={styles.durationBadge}>⏱️ {prog.duration}</span>
                          )}
                        </div>
                        <h2 className={styles.cardTitle}>{prog.title}</h2>
                        <p className={styles.cardDesc}>
                          {isOpen ? prog.description : prog.description.slice(0, 200) + (prog.description.length > 200 ? '...' : '')}
                        </p>
                      </div>

                      {isOpen && (
                        <div className={styles.cardDetails}>
                          {prog.isClub && prog.province && (
                            <div className={styles.detailBlock}>
                              <h4>📍 Província</h4>
                              <p>{prog.province}</p>
                            </div>
                          )}
                          {prog.isClub && prog.lema && (
                            <div className={styles.detailBlock}>
                              <h4>💬 Lema</h4>
                              <p>{prog.lema}</p>
                            </div>
                          )}
                          {prog.isClub && prog.missao && (
                            <div className={styles.detailBlock}>
                              <h4>🎯 Missão</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.missao}</p>
                            </div>
                          )}
                          {prog.isClub && prog.visao && (
                            <div className={styles.detailBlock}>
                              <h4>👁️ Visão</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.visao}</p>
                            </div>
                          )}
                          {prog.isClub && prog.valores && (
                            <div className={styles.detailBlock}>
                              <h4>💎 Valores</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.valores}</p>
                            </div>
                          )}
                          {prog.isClub && prog.objectivos && (
                            <div className={styles.detailBlock}>
                              <h4>📊 Objectivos</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.objectivos}</p>
                            </div>
                          )}
                          {prog.isClub && prog.areasActuacao && (
                            <div className={styles.detailBlock}>
                              <h4>🗺️ Áreas de Actuação</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.areasActuacao}</p>
                            </div>
                          )}
                          {prog.isClub && prog.actividades && (
                            <div className={styles.detailBlock}>
                              <h4>📅 Actividades</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.actividades}</p>
                            </div>
                          )}
                          {prog.isClub && prog.beneficiosMembros && (
                            <div className={styles.detailBlock}>
                              <h4>🎁 Benefícios para os Membros</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.beneficiosMembros}</p>
                            </div>
                          )}
                          {prog.isClub && prog.compromissoMembros && (
                            <div className={styles.detailBlock}>
                              <h4>🤝 Compromisso dos Membros</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.compromissoMembros}</p>
                            </div>
                          )}
                          {!prog.isClub && prog.publicoAlvo && (
                            <div className={styles.detailBlock}>
                              <h4>👥 Público-Alvo</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.publicoAlvo}</p>
                            </div>
                          )}
                          {!prog.isClub && prog.beneficios && (
                            <div className={styles.detailBlock}>
                              <h4>🎁 Benefícios</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.beneficios}</p>
                            </div>
                          )}
                          {!prog.isClub && prog.requisitos && (
                            <div className={styles.detailBlock}>
                              <h4>📋 Requisitos</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.requisitos}</p>
                            </div>
                          )}
                          {!prog.isClub && prog.investimento && (
                            <div className={styles.detailBlock}>
                              <h4>💰 Investimento</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.investimento}</p>
                            </div>
                          )}
                          {!prog.isClub && prog.processoSelecao && (
                            <div className={styles.detailBlock}>
                              <h4>🔍 Processo de Seleção</h4>
                              <p style={{ whiteSpace: 'pre-line' }}>{prog.processoSelecao}</p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className={styles.cardFooter}>
                        <button
                          className={styles.toggleBtn}
                          onClick={() => setExpanded(isOpen ? null : prog._id)}
                        >
                          {isOpen ? 'Ver Menos ▲' : 'Saber Mais ▼'}
                        </button>
                        <Link href="/registro" className={styles.applyBtn}>
                          Candidatar-me
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
}
