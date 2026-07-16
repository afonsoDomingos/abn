'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

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
          // Filter upcoming and slice first 3
          const upcoming = data.events.filter((e: Event) => e.type === 'upcoming').slice(0, 3);
          setEvents(upcoming.length > 0 ? upcoming : data.events.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  if (events.length === 0) return null;

  return (
    <section style={{
      padding: '5rem 2rem',
      background: 'linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%)',
      borderTop: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            display: 'inline-block',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#3498db',
            background: 'rgba(52,152,219,0.08)',
            border: '1px solid rgba(52,152,219,0.25)',
            padding: '0.3rem 1rem',
            borderRadius: '50px',
            marginBottom: '1.25rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            📅 {language === 'pt' ? 'Agenda de Eventos' : 'Events Calendar'}
          </span>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 1rem'
          }}>
            {language === 'pt' ? 'Próximos Eventos & Summits' : 'Upcoming Events & Summits'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
            {language === 'pt'
              ? 'Conecte-se com mentores, investidores e líderes de negócios em eventos desenhados para África.'
              : 'Connect with mentors, investors and business leaders in events tailored for Africa.'}
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {events.map(ev => {
            const dateObj = new Date(ev.date);
            const formattedDate = dateObj.toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });

            return (
              <div key={ev._id} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.3s, transform 0.3s',
              }}
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
                  <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative' }}>
                    <img src={ev.imageUrl} alt={ev.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{
                      position: 'absolute', top: '12px', left: '12px',
                      fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                      color: '#3498db', background: 'rgba(10, 10, 10, 0.85)',
                      padding: '0.25rem 0.75rem', borderRadius: '50px',
                      border: '1px solid rgba(52,152,219,0.3)',
                      fontFamily: 'Outfit, sans-serif'
                    }}>
                      {ev.category}
                    </span>
                  </div>
                )}

                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flexGrow: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: '#3498db', fontWeight: 600 }}>
                    <span>📅 {formattedDate}</span>
                  </div>

                  <h3 style={{
                    fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 700,
                    color: '#fff', margin: 0, lineHeight: 1.35
                  }}>{ev.title}</h3>

                  <p style={{
                    color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem',
                    lineHeight: '1.6', margin: 0, flexGrow: 1
                  }}>
                    {ev.description.slice(0, 120)}...
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>📍 {ev.location}</span>
                    <Link href="/eventos" style={{
                      color: '#3498db', fontSize: '0.8rem', fontWeight: 700,
                      textDecoration: 'none', fontFamily: 'Outfit, sans-serif'
                    }}>
                      {language === 'pt' ? 'Detalhes →' : 'Details →'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/eventos" style={{
            display: 'inline-block',
            background: 'transparent',
            color: '#3498db',
            border: '1.5px solid rgba(52,152,219,0.4)',
            fontWeight: 700,
            fontSize: '0.9rem',
            padding: '0.85rem 2.5rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontFamily: 'Outfit, sans-serif'
          }}>
            {language === 'pt' ? 'Ver Todos os Eventos →' : 'View All Events →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
