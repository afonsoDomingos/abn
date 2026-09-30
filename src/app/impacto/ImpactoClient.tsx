'use client';

import { useState, useEffect } from 'react';
import styles from './ImpactoPublic.module.css';

interface StatItem {
  label: string;
  value: string;
}

interface ReportItem {
  title: string;
  year: string;
  fileUrl: string;
}

interface CaseItem {
  title: string;
  desc: string;
  img: string;
  category: string;
  statsSnippet: string;
}

interface CompanyItem {
  name: string;
  location: string;
  desc: string;
  icon: string;
  phase: string;
  type: 'incubada' | 'apoiada';
}

interface ImpactoClientProps {
  stats: StatItem[];
  reports: ReportItem[];
  cases: CaseItem[];
  companies: CompanyItem[];
}

export default function ImpactoClient({ stats: initialStats, reports: initialReports, cases: initialCases, companies: initialCompanies }: ImpactoClientProps) {
  const [selectedFilter, setSelectedFilter] = useState<'todas' | 'incubadas' | 'apoiadas'>('todas');
  const [activeCase, setActiveCase] = useState<CaseItem | null>(null);

  // Estados locais para dados com atualização automática
  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [cases, setCases] = useState<CaseItem[]>(initialCases);
  const [companies, setCompanies] = useState<CompanyItem[]>(initialCompanies);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Polling para atualização automática (a cada 30 segundos)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/config');
        const data = await res.json();

        if (data.configs) {
          // Atualizar apenas se houver dados novos
          if (data.configs.stats_content) {
            setStats(data.configs.stats_content);
          }
          if (data.configs.reports_content) {
            setReports(data.configs.reports_content);
          }
          if (data.configs.cases_content) {
            setCases(data.configs.cases_content);
          }
          if (data.configs.supported_companies) {
            const parsedCompanies = data.configs.supported_companies.map((c: any) => ({
              ...c,
              type: c.type || 'incubada'
            }));
            setCompanies(parsedCompanies);
          }
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Erro ao buscar dados atualizados:', error);
      }
    };

    // Buscar dados imediatamente ao montar
    fetchData();

    // Configurar polling a cada 30 segundos
    const interval = setInterval(fetchData, 30000);

    // Limpar interval ao desmontar
    return () => clearInterval(interval);
  }, []);

  // Filter companies
  const filteredCompanies = companies.filter(c => {
    if (selectedFilter === 'todas') return true;
    if (selectedFilter === 'incubadas') return c.type === 'incubada';
    if (selectedFilter === 'apoiadas') return c.type === 'apoiada';
    return true;
  });

  return (
    <>
      {/* Indicador de atualização automática */}
      {lastUpdate && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
          Atualizado: {lastUpdate.toLocaleTimeString('pt-PT')}
        </div>
      )}

      {/* 1. Indicadores de Impacto */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Indicadores de Impacto</h2>
          <p className={styles.sectionSubtitle}>
            Consulte os números que refletem as conquistas dos empreendedores e do nosso ecossistema.
          </p>
          
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Casos de Sucesso */}
      {cases.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Casos de Sucesso</h2>
            <p className={styles.sectionSubtitle}>
              Histórias inspiradoras de empreendedores que transformaram desafios em soluções de impacto real.
            </p>

            <div className={styles.casesGrid}>
              {cases.map((cs, i) => (
                <div key={i} className={styles.caseCard}>
                  <div className={styles.caseImgWrapper}>
                    <img src={cs.img || '/articles/nilza.png'} alt={cs.title} className={styles.caseImg} />
                    {cs.category && <span className={styles.caseCategory}>{cs.category}</span>}
                  </div>
                  <div className={styles.caseContent}>
                    <h3>{cs.title}</h3>
                    <p className={styles.caseDesc}>
                      {cs.desc.length > 120 ? `${cs.desc.substring(0, 120)}...` : cs.desc}
                    </p>
                    {cs.statsSnippet && (
                      <div className={styles.caseMetric}>
                        {cs.statsSnippet}
                      </div>
                    )}
                    <div className={styles.caseFooter}>
                      <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => setActiveCase(cs)}>
                        Ler História Completa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Startups & Empresas Apoiadas */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Ecossistema ABN</h2>
          <p className={styles.sectionSubtitle}>
            Conheça as startups incubadas e as empresas apoiadas pela Afrobiz Network.
          </p>

          <div className={styles.filters}>
            <button
              className={`${styles.filterBtn} ${selectedFilter === 'todas' ? styles.activeFilterBtn : ''}`}
              onClick={() => setSelectedFilter('todas')}
            >
              Todas ({companies.length})
            </button>
            <button
              className={`${styles.filterBtn} ${selectedFilter === 'incubadas' ? styles.activeFilterBtn : ''}`}
              onClick={() => setSelectedFilter('incubadas')}
            >
              Startups Incubadas ({companies.filter(c => c.type === 'incubada').length})
            </button>
            <button
              className={`${styles.filterBtn} ${selectedFilter === 'apoiadas' ? styles.activeFilterBtn : ''}`}
              onClick={() => setSelectedFilter('apoiadas')}
            >
              Empresas Apoiadas ({companies.filter(c => c.type === 'apoiada').length})
            </button>
          </div>

          <div className={styles.companiesGrid}>
            {filteredCompanies.map((c, i) => (
              <div key={i} className={styles.companyCard}>
                <div className={styles.companyHeader}>
                  <div className={styles.companyLogo}>
                    {c.icon && (c.icon.startsWith('http') || c.icon.startsWith('/')) ? (
                      <img src={c.icon} alt={c.name} />
                    ) : (
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ff6b00' }}>{c.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <span className={styles.companyType}>
                    {c.type === 'incubada' ? 'Incubada' : 'Apoiada'}
                  </span>
                </div>
                <div className={styles.companyInfo}>
                  <h4>{c.name}</h4>
                  <div className={styles.companyMeta}>
                    {c.location && <span>{c.location}</span>}
                    {c.phase && <span>{c.phase}</span>}
                  </div>
                </div>
                <p className={styles.companyDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Relatórios Anuais */}
      {reports.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Relatórios de Impacto</h2>
            <p className={styles.sectionSubtitle}>
              Descarregue os relatórios anuais de atividades e impacto socioeconómico produzidos pela ABN.
            </p>

            <div className={styles.reportsGrid}>
              {reports.map((report, i) => (
                <div key={i} className={styles.reportCard}>
                  <h4>{report.title}</h4>
                  <span className={styles.reportYear}>{report.year}</span>
                  {report.fileUrl ? (
                    <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', textDecoration: 'none' }}>
                      Download PDF
                    </a>
                  ) : (
                    <button className="btn-outline" disabled style={{ opacity: 0.5, padding: '8px 20px', fontSize: '0.85rem' }}>
                      Não disponível
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Details Modal */}
      {activeCase && (
        <div className={styles.modalOverlay} onClick={() => setActiveCase(null)}>
          <div className={`${styles.modalContent} glass`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setActiveCase(null)}></button>
            <div className={styles.modalHeader}>
              <span className={styles.caseCategory} style={{ position: 'static', display: 'inline-block', marginBottom: '0.5rem' }}>
                {activeCase.category}
              </span>
              <h2>{activeCase.title}</h2>
            </div>
            
            {activeCase.img && (
              <img src={activeCase.img} alt={activeCase.title} className={styles.modalImg} />
            )}

            {activeCase.statsSnippet && (
              <div className={styles.caseMetric} style={{ marginBottom: '1.5rem' }}>
                Destaque de Impacto: {activeCase.statsSnippet}
              </div>
            )}

            <p className={styles.modalDescription}>{activeCase.desc}</p>
          </div>
        </div>
      )}
    </>
  );
}
