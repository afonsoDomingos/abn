'use client';

import { useState } from 'react';
import styles from './EventosPublic.module.css';

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'upcoming' | 'past';
  category: 'Conferência' | 'Feira' | 'Missão Empresarial' | 'Summit ABN' | 'Outro';
  imageUrl?: string;
  link?: string;
}

interface EventosClientProps {
  initialEvents: EventItem[];
}

export default function EventosClient({ initialEvents }: EventosClientProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showInscriptionForm, setShowInscriptionForm] = useState(false);
  const [inscriptionSubmitted, setInscriptionSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cargo, setCargo] = useState('');
  const [sector, setSector] = useState('');
  const [motivoParticipacao, setMotivoParticipacao] = useState('');
  const [necessidadesEspeciais, setNecessidadesEspeciais] = useState('');

  // Helper date elements for date badge
  const getDateParts = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { day: '01', month: 'JAN' };
      const day = d.getDate().toString().padStart(2, '0');
      const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
      const month = months[d.getMonth()];
      return { day, month };
    } catch {
      return { day: '01', month: 'JAN' };
    }
  };

  const formatDateLong = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Filter events by tab (upcoming/past) and category
  const filteredEvents = initialEvents.filter(ev => {
    const matchesTab = ev.type === activeTab;
    const matchesCategory = selectedCategory === 'Todos' || ev.category === selectedCategory;
    return matchesTab && matchesCategory;
  });

  const categories = ['Todos', 'Summit ABN', 'Conferência', 'Feira', 'Missão Empresarial', 'Outro'];

  const handleInscriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/events/inscricoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: selectedEvent._id,
          eventTitle: selectedEvent.title,
          nomeCompleto,
          email,
          telefone,
          empresa,
          cargo,
          sector,
          motivoParticipacao,
          necessidadesEspeciais,
          origem: 'eventos'
        }),
      });
      const data = await response.json();
      if (data.success) {
        setInscriptionSubmitted(true);
      } else {
        alert('Erro ao submeter inscrição: ' + (data.error || 'Tente novamente'));
      }
    } catch (error) {
      alert('Erro ao submeter inscrição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const openInscriptionForm = (event: EventItem) => {
    setSelectedEvent(event);
    setShowInscriptionForm(true);
    setInscriptionSubmitted(false);
    setNomeCompleto('');
    setEmail('');
    setTelefone('');
    setEmpresa('');
    setCargo('');
    setSector('');
    setMotivoParticipacao('');
    setNecessidadesEspeciais('');
  };

  const closeInscriptionForm = () => {
    setShowInscriptionForm(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <div className={styles.typeTabs}>
        <button
          className={`${styles.typeTabBtn} ${activeTab === 'upcoming' ? styles.activeTypeTab : ''}`}
          onClick={() => { setActiveTab('upcoming'); setSelectedCategory('Todos'); }}
        >
          Próximos Eventos
        </button>
        <button
          className={`${styles.typeTabBtn} ${activeTab === 'past' ? styles.activeTypeTab : ''}`}
          onClick={() => { setActiveTab('past'); setSelectedCategory('Todos'); }}
        >
          Eventos Realizados
        </button>
      </div>

      <div className={styles.filters}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${selectedCategory === cat ? styles.activeFilterBtn : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredEvents.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhum evento registrado nesta categoria no momento.</p>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {filteredEvents.map(ev => {
            const dateParts = getDateParts(ev.date);
            return (
              <div key={ev._id} className={styles.eventCard}>
                <div className={styles.imgWrapper}>
                  <img src={ev.imageUrl || '/articles/nilza.png'} alt={ev.title} className={styles.eventImg} />
                  <span className={styles.categoryBadge}>{ev.category}</span>
                  <div className={styles.dateBadge}>
                    <span className={styles.dateDay}>{dateParts.day}</span>
                    <span className={styles.dateMonth}>{dateParts.month}</span>
                  </div>
                </div>
                
                <div className={styles.cardContent}>
                  <h3>{ev.title}</h3>
                  <p className={styles.eventDesc}>
                    {ev.description.length > 150 ? `${ev.description.substring(0, 150)}...` : ev.description}
                  </p>
                  
                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <span>Data:</span>
                      <strong>{formatDateLong(ev.date)}</strong>
                    </div>
                    <div className={styles.metaItem}>
                      <span>Local:</span>
                      <span>{ev.location}</span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => setSelectedEvent(ev)}>
                      Ver Detalhes
                    </button>
                    {ev.type === 'upcoming' && (
                      <button 
                        className="btn-primary" 
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        onClick={() => openInscriptionForm(ev)}
                      >
                        Inscrever-se
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
          <div className={`${styles.modalContent} glass`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setSelectedEvent(null)}>✕</button>
            
            <div className={styles.modalHeader}>
              <span className={styles.categoryBadge} style={{ position: 'static', display: 'inline-block', marginBottom: '0.5rem' }}>
                {selectedEvent.category}
              </span>
              <h2>{selectedEvent.title}</h2>
            </div>

            {selectedEvent.imageUrl && (
              <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className={styles.modalImg} />
            )}

            <div className={styles.cardMeta} style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
              <div className={styles.metaItem}>
                <span>Data:</span>
                <strong>{formatDateLong(selectedEvent.date)}</strong>
              </div>
              <div className={styles.metaItem}>
                <span>Local / Formato:</span>
                <span>{selectedEvent.location}</span>
              </div>
            </div>

            <p className={styles.modalDescription}>{selectedEvent.description}</p>

            <div className={styles.modalFooter}>
              <button className="btn-outline" onClick={() => setSelectedEvent(null)}>Fechar</button>
              {selectedEvent.type === 'upcoming' && (
                <button 
                  className="btn-primary" 
                  style={{ textDecoration: 'none' }}
                  onClick={() => {
                    setSelectedEvent(null);
                    openInscriptionForm(selectedEvent);
                  }}
                >
                  Inscrever-se
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inscription Form Modal */}
      {showInscriptionForm && selectedEvent && (
        <div className={styles.modalOverlay} onClick={closeInscriptionForm}>
          <div className={`${styles.modalContent} glass`} style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={closeInscriptionForm}>✕</button>
            
            {inscriptionSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Inscrição Recebida!</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
                  Obrigado, <strong>{nomeCompleto}</strong>! A sua inscrição para <strong>{selectedEvent.title}</strong> foi recebida com sucesso.
                </p>
                <button className="btn-primary" onClick={closeInscriptionForm}>Fechar</button>
              </div>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <h2>Inscrever-se no Evento</h2>
                  <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0.5rem 0 0' }}>{selectedEvent.title}</p>
                </div>

                <form onSubmit={handleInscriptionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={nomeCompleto}
                      onChange={e => setNomeCompleto(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        outline: 'none'
                      }}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        outline: 'none'
                      }}
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        outline: 'none'
                      }}
                      placeholder="+258 ..."
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={empresa}
                      onChange={e => setEmpresa(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        outline: 'none'
                      }}
                      placeholder="Nome da sua empresa"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={cargo}
                      onChange={e => setCargo(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        outline: 'none'
                      }}
                      placeholder="Seu cargo"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                      Sector
                    </label>
                    <input
                      type="text"
                      value={sector}
                      onChange={e => setSector(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        outline: 'none'
                      }}
                      placeholder="Sector de atividade"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                      Motivo de Participação
                    </label>
                    <textarea
                      value={motivoParticipacao}
                      onChange={e => setMotivoParticipacao(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                      placeholder="Por que quer participar neste evento?"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                      Necessidades Especiais
                    </label>
                    <textarea
                      value={necessidadesEspeciais}
                      onChange={e => setNecessidadesEspeciais(e.target.value)}
                      rows={2}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                      placeholder="Alguma necessidade especial (acessibilidade, alimentação, etc.)?"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="button" className="btn-outline" onClick={closeInscriptionForm}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
                      {loading ? 'A enviar...' : 'Confirmar Inscrição'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
