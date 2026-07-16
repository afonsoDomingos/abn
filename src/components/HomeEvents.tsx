'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';
import styles from './HomeEvents.module.css';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  category: string;
  imageUrl: string;
  link: string;
}

export default function HomeEvents() {
  const { language } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (data.events) {
          const upcoming = data.events.filter((e: Event) => e.type === 'upcoming').slice(0, 3);
          setEvents(upcoming.length > 0 ? upcoming : data.events.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  if (events.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>
            📅 {language === 'pt' ? 'Agenda de Eventos' : 'Events Calendar'}
          </span>
          <h2 className={styles.title}>
            {language === 'pt' ? 'Próximos Eventos & Summits' : 'Upcoming Events & Summits'}
          </h2>
          <p className={styles.subtitle}>
            {language === 'pt'
              ? 'Conecte-se com mentores, investidores e líderes de negócios em eventos desenhados para África.'
              : 'Connect with mentors, investors and business leaders in events tailored for Africa.'}
          </p>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {events.map(ev => {
            const dateObj = new Date(ev.date);
            const formattedDate = dateObj.toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });

            return (
              <div
                key={ev._id}
                className={styles.card}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(52,152,219,0.4)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Event Image */}
                {ev.imageUrl && (
                  <div className={styles.imageBox}>
                    <img src={ev.imageUrl} alt={ev.title} className={styles.image} />
                    <span className={styles.catTag}>
                      {ev.category}
                    </span>
                  </div>
                )}

                <div className={styles.body}>
                  <div className={styles.dateRow}>
                    <span>📅 {formattedDate}</span>
                  </div>

                  <h3 className={styles.cardTitle}>{ev.title}</h3>

                  <p className={styles.cardDesc}>
                    {ev.description.slice(0, 120)}...
                  </p>

                  <div className={styles.cardFooter}>
                    <span className={styles.location}>📍 {ev.location}</span>
                    <Link href="/eventos" className={styles.detailsBtn}>
                      {language === 'pt' ? 'Detalhes →' : 'Details →'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className={styles.footer}>
          <Link href="/eventos" className={styles.ctaBtn}>
            {language === 'pt' ? 'Ver Todos os Eventos →' : 'View All Events →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
