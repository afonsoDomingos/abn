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
          <span>📅</span>
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
                      <span>📅</span>
                      <strong>{formatDateLong(ev.date)}</strong>
                    </div>
                    <div className={styles.metaItem}>
                      <span>📍</span>
                      <span>{ev.location}</span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => setSelectedEvent(ev)}>
                      Ver Detalhes
                    </button>
                    {ev.type === 'upcoming' && ev.link && (
                      <a href={ev.link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}>
                        Inscrever-se
                      </a>
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
                <span>📅 Data:</span>
                <strong>{formatDateLong(selectedEvent.date)}</strong>
              </div>
              <div className={styles.metaItem}>
                <span>📍 Local / Formato:</span>
                <span>{selectedEvent.location}</span>
              </div>
            </div>

            <p className={styles.modalDescription}>{selectedEvent.description}</p>

            <div className={styles.modalFooter}>
              <button className="btn-outline" onClick={() => setSelectedEvent(null)}>Fechar</button>
              {selectedEvent.type === 'upcoming' && selectedEvent.link && (
                <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
                  Avançar para Inscrição
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
