import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import styles from './page.module.css';

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    await dbConnect();
    const event = await Event.findOne({ title: decodeURIComponent(slug) }).lean();
    
    if (!event) {
      return {
        title: 'Evento não encontrado - ABN Eventos',
      };
    }

    return {
      title: `${event.title} - ABN Eventos`,
      description: event.description?.substring(0, 160) || 'Evento da AfroBiz Network',
    };
  } catch {
    return {
      title: 'Evento - ABN Eventos',
    };
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  
  try {
    await dbConnect();
    const event = await Event.findOne({ title: decodeURIComponent(slug) }).lean();
    
    if (!event) {
      notFound();
    }

    const program = event.program || [];
    const speakers = event.speakers || [];
    const countries = event.countries || [];
    const tickets = event.tickets || [];
    const sponsorshipPackages = event.sponsorshipPackages || [];
    const sponsors = event.sponsors || [];

    return (
      <main className={styles.eventPage}>
        <Navbar />
        
        <header className={styles.header}>
          <div className={styles.container}>
            <div className={styles.headerContent}>
              <div>
                {event.category && <span className={styles.categoryBadge}>{event.category}</span>}
                <h1 className="text-gradient-gold">{event.title}</h1>
                <p className={styles.headerDescription}>{event.description}</p>
                <div className={styles.headerMeta}>
                  <div className={styles.metaItem}>
                    <span>Data:</span>
                    <strong>{event.date}</strong>
                    {event.endDate && <span> a {event.endDate}</span>}
                  </div>
                  <div className={styles.metaItem}>
                    <span>Local:</span>
                    <strong>{event.location}</strong>
                  </div>
                </div>
              </div>
              
              {event.imageUrl && (
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className={styles.headerImage}
                />
              )}
            </div>
          </div>
        </header>

        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Left Column */}
            <div className={styles.mainContent}>
              {/* Programa */}
              {program.length > 0 && (
                <section className={styles.section}>
                  <h2>Programa</h2>
                  <div className={styles.programList}>
                    {program.map((item: any, idx: number) => (
                      <div key={idx} className={styles.programItem}>
                        <div className={styles.programTime}>{item.time}</div>
                        <div className={styles.programDetails}>
                          <h3>{item.title}</h3>
                          {item.speaker && <p className={styles.programSpeaker}>{item.speaker}</p>}
                          {item.description && <p className={styles.programDescription}>{item.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Oradores */}
              {speakers.length > 0 && (
                <section className={styles.section}>
                  <h2>Oradores</h2>
                  <div className={styles.speakersGrid}>
                    {speakers.map((speaker: any, idx: number) => (
                      <div key={idx} className={styles.speakerCard}>
                        {speaker.photo && (
                          <img 
                            src={speaker.photo} 
                            alt={speaker.name} 
                            className={styles.speakerPhoto}
                          />
                        )}
                        <h3>{speaker.name}</h3>
                        {speaker.role && <p className={styles.speakerRole}>{speaker.role}</p>}
                        {speaker.company && <p className={styles.speakerCompany}>{speaker.company}</p>}
                        {speaker.bio && (
                          <p className={styles.speakerBio}>{speaker.bio.substring(0, 200)}...</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Países Participantes */}
              {countries.length > 0 && (
                <section className={styles.section}>
                  <h2>Países Participantes</h2>
                  <div className={styles.countriesList}>
                    {countries.map((country: string, idx: number) => (
                      <span key={idx} className={styles.countryTag}>
                        {country}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Patrocinadores */}
              {sponsors.length > 0 && (
                <section className={styles.section}>
                  <h2>Patrocinadores</h2>
                  <div className={styles.sponsorsGrid}>
                    {sponsors.map((sponsor: any, idx: number) => (
                      <div key={idx} className={styles.sponsorCard}>
                        {sponsor.logo && (
                          <img 
                            src={sponsor.logo} 
                            alt={sponsor.name} 
                            className={styles.sponsorLogo}
                          />
                        )}
                        <h3>{sponsor.name}</h3>
                        <span className={styles.sponsorLevel}>{sponsor.level}</span>
                        {sponsor.website && (
                          <a 
                            href={sponsor.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.sponsorLink}
                          >
                            Visitar site
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className={styles.sidebar}>
              {/* Bilhetes */}
              {tickets.length > 0 && (
                <div className={styles.sidebarCard}>
                  <h3>Bilhetes</h3>
                  <div className={styles.ticketsList}>
                    {tickets.map((ticket: any, idx: number) => (
                      <div key={idx} className={styles.ticketCard}>
                        <div className={styles.ticketType}>{ticket.type === 'empresa' ? '🏢 Empresa' : '👤 Empreendedor'}</div>
                        <h4>{ticket.name}</h4>
                        <p className={styles.ticketPrice}>
                          {ticket.price.toLocaleString()} {ticket.currency}
                        </p>
                        {ticket.description && (
                          <p className={styles.ticketDescription}>{ticket.description}</p>
                        )}
                        {ticket.benefits && ticket.benefits.length > 0 && (
                          <ul className={styles.ticketBenefits}>
                            {ticket.benefits.map((benefit: string, bIdx: number) => (
                              <li key={bIdx}>{benefit}</li>
                            ))}
                          </ul>
                        )}
                        {ticket.includes && ticket.includes.length > 0 && (
                          <div className={styles.ticketIncludes}>
                            <strong>Inclui:</strong>
                            <ul>
                              {ticket.includes.map((item: string, iIdx: number) => (
                                <li key={iIdx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                          Comprar Bilhete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pacotes de Patrocínio */}
              {sponsorshipPackages.length > 0 && (
                <div className={styles.sidebarCard}>
                  <h3>Pacotes de Patrocínio</h3>
                  <div className={styles.packagesList}>
                    {sponsorshipPackages.map((pkg: any, idx: number) => (
                      <div key={idx} className={styles.packageCard}>
                        <h4>{pkg.name}</h4>
                        <p className={styles.packagePrice}>
                          {pkg.price.toLocaleString()} {pkg.currency}
                        </p>
                        {pkg.description && (
                          <p className={styles.packageDescription}>{pkg.description}</p>
                        )}
                        {pkg.benefits && pkg.benefits.length > 0 && (
                          <ul className={styles.packageBenefits}>
                            {pkg.benefits.map((benefit: string, bIdx: number) => (
                              <li key={bIdx}>{benefit}</li>
                            ))}
                          </ul>
                        )}
                        {pkg.visibility && pkg.visibility.length > 0 && (
                          <div className={styles.packageVisibility}>
                            <strong>Visibilidade:</strong>
                            <ul>
                              {pkg.visibility.map((item: string, vIdx: number) => (
                                <li key={vIdx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <button className="btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
                          Solicitar Patrocínio
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className={styles.sidebarCard} style={{ background: 'linear-gradient(135deg, #de9b35 0%, #f5c76e 100%)' }}>
                <h3 style={{ color: '#111827' }}>Interessado?</h3>
                <p style={{ color: '#111827', opacity: 0.8, marginBottom: '1rem' }}>
                  Reserve o seu lugar e participe deste evento exclusivo.
                </p>
                <a href="/eventos" className="btn-primary" style={{ background: '#111827', color: '#fff' }}>
                  Ver Todos os Eventos
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading event:', error);
    notFound();
  }
}
