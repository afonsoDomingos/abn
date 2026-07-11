'use client';

import { useEffect, useState, use } from 'react';
import Navbar from '@/components/Navbar';
import styles from './CountryHub.module.css';
import { useLanguage } from '@/lib/LanguageContext';

const fallbackHubs: Record<string, any> = {
  quinebissau: {
    name: 'Guiné-Bissau',
    slug: 'quinebissau',
    image: '/guine_bissau_banner.png',
    description: 'A delegação da ABN em Guiné-Bissau fomenta o ecossistema de empreendedorismo local através de incubação acelerada de ideias, conexão com investidores internacionais e facilitação de redes de mercados sustentáveis.',
    steps: [
      { title: 'Fase de Candidatura', description: 'Preencha o formulário online detalhando o seu negócio ou ideia de impacto.' },
      { title: 'Entrevista & Pitching', description: 'Apresente a sua equipa e proposta de valor à nossa comissão de mentores.' },
      { title: 'Incubação Activa', description: 'Aceda a mentoria estratégica personalizada e recursos para expansão.' }
    ],
    faqs: [
      { question: 'Quem se pode candidatar?', answer: 'Jovens guineenses residentes em Bissau, estudantes ou profissionais com projetos inovadores de base tecnológica ou sustentável.' },
      { question: 'Existe algum custo associado?', answer: 'Não, todos os programas oferecidos pela ABN Guiné-Bissau são totalmente gratuitos.' }
    ],
    address: 'Bissau, Guiné-Bissau - Avenida Combatentes da Liberdade da Pátria',
    email: 'guinebissau@afrobiznetwork.com',
    phone: '+245 955 000 000',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
    events: [
      {
        title: 'Fórum de Adaptação de Lideranças Juvenis',
        date: '14 de Outubro de 2026',
        description: 'Encontro de jovens empreendedores e líderes focado no desenvolvimento de competências verdes e negócios de impacto ecológico.',
        type: 'future',
        link: 'https://wa.me/258845773974'
      },
      {
        title: 'Workshop Mentoria Spark Guiné',
        date: '12 de Fevereiro de 2026',
        description: 'Sessão intensiva de ideação e validação de modelos de negócio para startups locais na fase inicial.',
        type: 'past',
        image: '/guine_bissau_banner.png'
      }
    ],
    representative: {
      name: 'Mamadu Baldé',
      role: 'Diretor de Delegação - ABN Guiné-Bissau',
      email: 'mamadu.balde@afrobiznetwork.com',
      phone: '+245 955 123 456',
      image: ''
    },
    team: [
      { name: 'Fatoumata Djaló', role: 'Gestora de Programas e Incubação', image: '' },
      { name: 'Umaro Sissoco', role: 'Coordenador de Parcerias e Impacto', image: '' }
    ]
  }
};

export default function CountryHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { language } = useLanguage();
  const { slug } = use(params);
  
  const [hub, setHub] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Events tab selection
  const [activeTab, setActiveTab] = useState<'future' | 'past'>('future');
  
  // FAQs expanded state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [sendingContact, setSendingContact] = useState(false);
  const [contactResult, setContactResult] = useState('');

  // Global Partners
  const [globalPartners, setGlobalPartners] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch Hub details
    fetch(`/api/hubs/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.hub) {
          setHub(data.hub);
        } else if (fallbackHubs[slug]) {
          setHub(fallbackHubs[slug]);
        } else {
          setError(data.error || 'Delegação não encontrada.');
        }
        setLoading(false);
      })
      .catch(() => {
        if (fallbackHubs[slug]) {
          setHub(fallbackHubs[slug]);
        } else {
          setError('Erro na conexão com o servidor.');
        }
        setLoading(false);
      });

    // 2. Fetch global partners for the logo bar
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.partners_content) {
          setGlobalPartners(data.configs.partners_content);
        }
      })
      .catch(() => {});
  }, [slug]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingContact(true);
    setContactResult('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: `[DELEGAÇÃO ${hub?.name || slug}] ${contactMsg}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setContactResult('Mensagem enviada com sucesso!');
        setContactName('');
        setContactEmail('');
        setContactMsg('');
      } else {
        setContactResult(data.error || 'Erro ao enviar a mensagem.');
      }
    } catch {
      setContactResult('Erro de conexão ao enviar.');
    } finally {
      setSendingContact(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <Navbar />
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner}></div>
          <p>A carregar delegação...</p>
        </div>
      </div>
    );
  }

  if (error || !hub) {
    return (
      <div className={styles.errorPage}>
        <Navbar />
        <div className={styles.errorWrapper}>
          <h2>Delegação Não Encontrada</h2>
          <p>{error || 'Esta delegação ainda não foi criada no ecossistema ABN.'}</p>
          <a href="/" className="btn-primary">Voltar ao Início</a>
        </div>
      </div>
    );
  }

  // Filter events
  const futureEvents = (hub.events || []).filter((e: any) => e.type === 'future');
  const pastEvents = (hub.events || []).filter((e: any) => e.type === 'past');
  const activeEvents = activeTab === 'future' ? futureEvents : pastEvents;

  return (
    <main className={styles.hubPage}>
      <Navbar />

      {/* 1. Hero Header */}
      <header 
        className={styles.hero} 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${hub.image})` }}
      >
        <div className={styles.heroContainer}>
          <div className={styles.badge}>ABN HUB</div>
          <h1 className="text-gradient-gold">{hub.name}</h1>
        </div>
      </header>

      {/* 2. Description Block */}
      <section className={styles.descSection}>
        <div className={styles.container}>
          <div className={styles.descCard}>
            <p className={styles.descriptionText}>{hub.description}</p>
          </div>
        </div>
      </section>

      {/* 3. Steps Block */}
      <section className={styles.stepsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Processo de Candidatura</h2>
          <div className={styles.stepsGrid}>
            {(hub.steps && hub.steps.length === 3 ? hub.steps : [
              { title: 'Fase de Candidatura', description: 'Preencha o formulário online detalhando o seu negócio.' },
              { title: 'Entrevista & Pitching', description: 'Apresente a sua equipa e proposta de valor a investidores.' },
              { title: 'Incubação Activa', description: 'Aceda a mentoria estratégica e ferramentas de escala global.' }
            ]).map((step: any, idx: number) => (
              <div key={idx} className={`${styles.stepCard} glass`}>
                <div className={styles.stepNumber}>{idx + 1}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5. Representative & Local Team Section */}
      {(hub.representative?.name || (hub.team && hub.team.length > 0)) && (
        <section className={styles.teamSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Equipa Local</h2>
            
            {/* Representative Card */}
            {hub.representative?.name && (
              <div className={styles.representativeWrapper}>
                <div className={`${styles.representativeCard} glass`}>
                  <img 
                    src={hub.representative.image || '/default-avatar.png'} 
                    alt={hub.representative.name} 
                    className={styles.repAvatar}
                  />
                  <div className={styles.repInfo}>
                    <span className={styles.repBadge}>Representante Local</span>
                    <h3>{hub.representative.name}</h3>
                    <p className={styles.repRole}>{hub.representative.role}</p>
                    <div className={styles.repContacts}>
                      <span>✉️ {hub.representative.email}</span>
                      <span>📞 {hub.representative.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Team Members Grid */}
            {hub.team && hub.team.length > 0 && (
              <div className={styles.teamGrid}>
                {hub.team.map((member: any, idx: number) => (
                  <div key={idx} className={`${styles.teamCard} glass`}>
                    <img 
                      src={member.image || '/default-avatar.png'} 
                      alt={member.name} 
                      className={styles.teamAvatar}
                    />
                    <h4>{member.name}</h4>
                    <p>{member.role}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. Events Block */}
      <section className={styles.eventsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nossos Eventos</h2>
          
          {/* Tab controls */}
          <div className={styles.tabsHeader}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'future' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('future')}
            >
              Eventos Futuros ({futureEvents.length})
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'past' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('past')}
            >
              Eventos Passados ({pastEvents.length})
            </button>
          </div>

          {/* Grid results */}
          {activeEvents.length === 0 ? (
            <div className={styles.noEvents}>
              <p>Nenhum evento agendado nesta categoria para o Hub {hub.name}.</p>
            </div>
          ) : (
            <div className={styles.eventsGrid}>
              {activeEvents.map((evt: any, idx: number) => (
                <div key={idx} className={`${styles.eventCard} glass`} style={{ padding: evt.image ? '0 0 2rem 0' : '2.5rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {evt.image && (
                    <img src={evt.image} alt={evt.title} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block', marginBottom: '1.5rem' }} />
                  )}
                  <div style={{ padding: evt.image ? '0 2rem' : '0', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
                    <div className={styles.eventBadge}>
                      {evt.type === 'future' ? 'Brevemente' : 'Concluído'}
                    </div>
                    <span className={styles.eventDate}>📅 {evt.date}</span>
                    <h3>{evt.title}</h3>
                    <p>{evt.description}</p>
                    {evt.link && (
                      <a href={evt.link} target="_blank" rel="noopener noreferrer" className={styles.eventLink} style={{ marginTop: 'auto' }}>
                        Saber mais &rarr;
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. FAQs & Quick Contact Form */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.faqContainerGrid}>
            {/* Left FAQ Accordion */}
            <div className={styles.faqCol}>
              <h2 className={styles.faqTitle}>FAQ</h2>
              <div className={styles.accordion}>
                {(hub.faqs && hub.faqs.length > 0 ? hub.faqs : [
                  { question: 'Quem pode candidatar-se aos programas?', answer: 'Jovens finalistas, recém-licenciados ou empreendedores com negócios nascentes com menos de 2 anos.' },
                  { question: 'A candidatura é gratuita?', answer: 'Sim, todas as candidaturas aos nossos programas de incubação são 100% gratuitas.' }
                ]).map((faqItem: any, idx: number) => (
                  <div key={idx} className={styles.faqItem}>
                    <button 
                      className={styles.faqQuestion} 
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    >
                      <span>{faqItem.question}</span>
                      <span>{expandedFaq === idx ? '▲' : '▼'}</span>
                    </button>
                    <div className={`${styles.faqAnswer} ${expandedFaq === idx ? styles.faqOpen : ''}`}>
                      <p>{faqItem.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Contact Form Box */}
            <div className={styles.contactFormCol}>
              <div className={styles.contactFormBox}>
                <h3>Como podemos ajudar?</h3>
                <p>Envie a sua dúvida ou sugestão e a nossa equipa local responderá o mais breve possível.</p>
                {contactResult && (
                  <div className={styles.resultMsg}>{contactResult}</div>
                )}
                <form onSubmit={handleContactSubmit} className={styles.contactForm}>
                  <div className={styles.formField}>
                    <label>Nome *</label>
                    <input 
                      type="text" 
                      value={contactName} 
                      onChange={e => setContactName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Email *</label>
                    <input 
                      type="email" 
                      value={contactEmail} 
                      onChange={e => setContactEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className={styles.formField}>
                    <label>Mensagem *</label>
                    <textarea 
                      value={contactMsg} 
                      onChange={e => setContactMsg(e.target.value)} 
                      required 
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={sendingContact}>
                    {sendingContact ? 'A enviar...' : 'Enviar'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Strategic Partners Grid */}
      {globalPartners.length > 0 && (
        <section className={styles.partnersSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Nossos Parceiros</h2>
            <div className={styles.partnersGrid}>
              {globalPartners.map((p, idx) => (
                <div key={idx} className={styles.partnerCard}>
                  {p.logo && (p.logo.startsWith('http') || p.logo.startsWith('/')) ? (
                    <img src={p.logo} alt={p.name} className={styles.partnerLogo} />
                  ) : (
                    <span className={styles.partnerEmoji}>{p.logo || '🤝'}</span>
                  )}
                  <span className={styles.partnerName}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Where to find us footer */}
      <footer className={styles.hubFooter}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerCol}>
              <h3>Onde nos encontrar?</h3>
              <div className={styles.footerPin}>
                📍
                <p>{hub.address}</p>
              </div>
            </div>
            
            <div className={styles.footerCol}>
              <h3>Contacto Direto</h3>
              <p>✉️ {hub.email}</p>
              <p>📞 {hub.phone}</p>
            </div>

            <div className={styles.footerCol}>
              <h3>Redes Sociais</h3>
              <div className={styles.footerSocials}>
                {hub.facebookUrl && <a href={hub.facebookUrl} target="_blank">Facebook</a>}
                {hub.instagramUrl && <a href={hub.instagramUrl} target="_blank">Instagram</a>}
                {hub.linkedinUrl && <a href={hub.linkedinUrl} target="_blank">LinkedIn</a>}
                {hub.youtubeUrl && <a href={hub.youtubeUrl} target="_blank">YouTube</a>}
              </div>
            </div>
          </div>

          <div className={styles.bottomBar}>
            <span>Copyright © ABN {new Date().getFullYear()} | Powered by <a href="http://isvibe.vercel.app/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Vibe</a></span>
          </div>
        </div>
      </footer>
    </main>
  );
}
