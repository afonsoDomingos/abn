import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/mongodb';
import Program from '@/models/Program';
import Team from '@/models/Team';
import styles from './page.module.css';

interface ProgramPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    await dbConnect();
    const program = await Program.findOne({ title: decodeURIComponent(slug) }).lean();
    
    if (!program) {
      return {
        title: 'Programa não encontrado - ABN Incubadora',
      };
    }

    return {
      title: `${program.title} - ABN Incubadora`,
      description: program.description?.substring(0, 160) || 'Programa de incubação e aceleração da ABN',
    };
  } catch {
    return {
      title: 'Programa - ABN Incubadora',
    };
  }
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  
  try {
    await dbConnect();
    const program = await Program.findOne({ title: decodeURIComponent(slug) }).lean();
    
    if (!program) {
      notFound();
    }

    // Fetch mentors if available
    let mentors: any[] = [];
    if (program.mentors && program.mentors.length > 0) {
      mentors = await Team.find({ _id: { $in: program.mentors } }).lean();
    }

    const countries = program.countries || ['Moçambique'];
    const criteriaByCountry = program.criteriaByCountry || {};
    const calendar = program.calendar || [];

    return (
      <main className={styles.programPage}>
        <Navbar />
        
        <header className={styles.header}>
          <div className={styles.container}>
            <div className={styles.headerContent}>
              <div>
                {program.phase && <span className={styles.phaseBadge}>{program.phase}</span>}
                <h1 className="text-gradient-gold">{program.title}</h1>
                <p className={styles.headerDescription}>{program.description}</p>
              </div>
              
              {program.sponsorLogo && (
                <div className={styles.sponsorSection}>
                  <span className={styles.sponsorLabel}>Patrocinado por:</span>
                  <img 
                    src={program.sponsorLogo} 
                    alt={program.sponsorName || 'Patrocinador'} 
                    className={styles.sponsorLogo}
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Left Column */}
            <div className={styles.mainContent}>
              {/* Objectivo */}
              <section className={styles.section}>
                <h2>Objectivo</h2>
                <p>{program.description}</p>
              </section>

              {/* Público-alvo */}
              {program.publicoAlvo && (
                <section className={styles.section}>
                  <h2>Público-alvo</h2>
                  <div className={styles.contentText}>
                    {program.publicoAlvo.split('\n').map((line: string, idx: number) => (
                      <p key={idx}>{line.replace(/^[-•*]\s*/, '')}</p>
                    ))}
                  </div>
                </section>
              )}

              {/* Países Abrangidos */}
              <section className={styles.section}>
                <h2>Países Abrangidos</h2>
                <div className={styles.countriesList}>
                  {countries.map((country: string, idx: number) => (
                    <span key={idx} className={styles.countryTag}>
                      {country}
                    </span>
                  ))}
                </div>
              </section>

              {/* Critérios por País */}
              {Object.keys(criteriaByCountry).length > 0 && (
                <section className={styles.section}>
                  <h2>Critérios de Admissão por País</h2>
                  {Object.entries(criteriaByCountry).map(([country, criteria]: [string, any]) => (
                    <div key={country} className={styles.countryCriteria}>
                      <h3>{country}</h3>
                      <div className={styles.criteriaList}>
                        {criteria.residency && (
                          <div className={styles.criteriaItem}>
                            <strong>Residência & Nacionalidade:</strong>
                            <p>{criteria.residency}</p>
                          </div>
                        )}
                        {criteria.ageRange && (
                          <div className={styles.criteriaItem}>
                            <strong>Faixa Etária:</strong>
                            <p>{criteria.ageRange}</p>
                          </div>
                        )}
                        {criteria.academicProfile && (
                          <div className={styles.criteriaItem}>
                            <strong>Perfil Académico:</strong>
                            <p>{criteria.academicProfile}</p>
                          </div>
                        )}
                        {criteria.businessStage && (
                          <div className={styles.criteriaItem}>
                            <strong>Conceito de Negócio:</strong>
                            <p>{criteria.businessStage}</p>
                          </div>
                        )}
                        {criteria.innovationPotential && (
                          <div className={styles.criteriaItem}>
                            <strong>Inovação & Potencial:</strong>
                            <p>{criteria.innovationPotential}</p>
                          </div>
                        )}
                        {criteria.candidateProfile && (
                          <div className={styles.criteriaItem}>
                            <strong>Perfil do Candidato:</strong>
                            <p>{criteria.candidateProfile}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {/* Benefícios */}
              {program.beneficios && (
                <section className={styles.section}>
                  <h2>Benefícios</h2>
                  <div className={styles.contentText}>
                    {program.beneficios.split('\n').map((line: string, idx: number) => (
                      <p key={idx}>{line.replace(/^[-•*]\s*/, '')}</p>
                    ))}
                  </div>
                </section>
              )}

              {/* Requisitos */}
              {program.requisitos && (
                <section className={styles.section}>
                  <h2>Requisitos</h2>
                  <div className={styles.contentText}>
                    {program.requisitos.split('\n').map((line: string, idx: number) => (
                      <p key={idx}>{line.replace(/^[-•*]\s*/, '')}</p>
                    ))}
                  </div>
                </section>
              )}

              {/* Calendário */}
              {calendar.length > 0 && (
                <section className={styles.section}>
                  <h2>Calendário</h2>
                  <div className={styles.calendarList}>
                    {calendar.map((item: any, idx: number) => (
                      <div key={idx} className={styles.calendarItem}>
                        <div className={styles.calendarDate}>{item.date}</div>
                        <div className={styles.calendarDetails}>
                          <h4>{item.event}</h4>
                          {item.location && <p className={styles.calendarLocation}>{item.location}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Mentores */}
              {mentors.length > 0 && (
                <section className={styles.section}>
                  <h2>Mentores</h2>
                  <div className={styles.mentorsGrid}>
                    {mentors.map((mentor: any) => (
                      <div key={mentor._id} className={styles.mentorCard}>
                        {mentor.photo && (
                          <img 
                            src={mentor.photo} 
                            alt={mentor.name} 
                            className={styles.mentorPhoto}
                          />
                        )}
                        <h3>{mentor.name}</h3>
                        <p className={styles.mentorRole}>{mentor.specialty || mentor.title}</p>
                        {mentor.bio && (
                          <p className={styles.mentorBio}>{mentor.bio.substring(0, 150)}...</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className={styles.sidebar}>
              {/* Duração */}
              <div className={styles.sidebarCard}>
                <h3>Duração</h3>
                <p className={styles.sidebarValue}>{program.duration || 'Contínuo'}</p>
              </div>

              {/* Custo */}
              <div className={styles.sidebarCard}>
                <h3>Custo</h3>
                <div className={styles.sidebarValue}>
                  {program.investimento ? (
                    <p>{program.investimento}</p>
                  ) : program.sponsorName ? (
                    <p>Gratuito com o apoio de {program.sponsorName}</p>
                  ) : (
                    <p>Gratuito</p>
                  )}
                </div>
              </div>

              {/* Processo de Seleção */}
              {program.processoSelecao && (
                <div className={styles.sidebarCard}>
                  <h3>Processo de Seleção</h3>
                  <div className={styles.sidebarText}>
                    {program.processoSelecao.split('\n').map((line: string, idx: number) => (
                      <p key={idx}>{line.replace(/^[-•*]\s*/, '')}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className={styles.sidebarCard} style={{ background: 'linear-gradient(135deg, #de9b35 0%, #f5c76e 100%)' }}>
                <h3 style={{ color: '#111827' }}>Interessado?</h3>
                <p style={{ color: '#111827', opacity: 0.8, marginBottom: '1rem' }}>
                  Candidata-se agora e transforme a sua ideia em negócio.
                </p>
                <a href="/incubacao" className="btn-primary" style={{ background: '#111827', color: '#fff' }}>
                  Ver Programas
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading program:', error);
    notFound();
  }
}
