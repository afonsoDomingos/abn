'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface Program {
  _id: string;
  title: string;
  description: string;
  phase?: string;
  duration?: string;
  status: string;
}

export default function HomePrograms() {
  const { language } = useLanguage();
  const [programs, setPrograms] = useState<Program[]>([]);

  useEffect(() => {
    fetch('/api/programs')
      .then(res => res.json())
      .then(data => {
        if (data.programs) {
          setPrograms(data.programs.filter((p: Program) => p.status === 'ativo').slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  if (programs.length === 0) return null;

  const phaseColors: Record<string, string> = {
    'Incubação & Aceleração': '#d4af37',
    'Desenvolvimento': '#3498db',
    'Formação': '#2ecc71',
    'Networking': '#e67e22',
  };

  return (
    <section style={{
      padding: '5rem 2rem',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%)',
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
            color: 'var(--primary)',
            background: 'rgba(212,175,55,0.08)',
            border: '1px solid rgba(212,175,55,0.2)',
            padding: '0.3rem 1rem',
            borderRadius: '50px',
            marginBottom: '1.25rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            🚀 {language === 'pt' ? 'Programas ABN' : 'ABN Programs'}
          </span>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 1rem'
          }}>
            {language === 'pt' ? 'Programas de Incubação & Aceleração' : 'Incubation & Acceleration Programs'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
            {language === 'pt'
              ? 'Desde a ideia até ao crescimento: acompanhamos empreendedores em cada etapa da jornada.'
              : 'From idea to growth: we support entrepreneurs at every step of the journey.'}
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {programs.map(prog => {
            const phaseColor = phaseColors[prog.phase || ''] || '#d4af37';
            return (
              <div key={prog._id} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                transition: 'border-color 0.3s, transform 0.3s',
                cursor: 'default'
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.4)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const }}>
                  {prog.phase && (
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.07em',
                      color: phaseColor,
                      background: `${phaseColor}18`,
                      padding: '0.28rem 0.8rem',
                      borderRadius: '50px',
                      fontFamily: 'Outfit, sans-serif'
                    }}>{prog.phase}</span>
                  )}
                  {prog.duration && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.45)',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '0.28rem 0.7rem',
                      borderRadius: '50px'
                    }}>⏱️ {prog.duration}</span>
                  )}
                </div>
                <h3 style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.35
                }}>{prog.title}</h3>
                <p style={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.9rem',
                  lineHeight: '1.65',
                  margin: 0,
                  flexGrow: 1
                }}>
                  {prog.description.slice(0, 160)}...
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/programas" style={{
            display: 'inline-block',
            background: 'transparent',
            color: 'var(--primary)',
            border: '1.5px solid rgba(212,175,55,0.5)',
            fontWeight: 700,
            fontSize: '0.9rem',
            padding: '0.85rem 2.5rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontFamily: 'Outfit, sans-serif',
            transition: 'all 0.2s'
          }}>
            {language === 'pt' ? 'Ver Todos os Programas →' : 'View All Programs →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
