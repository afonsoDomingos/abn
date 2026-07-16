'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  category: string;
  amount?: string;
  deadline?: string;
  provider?: string;
  location?: string;
  applyLink?: string;
}

const catColors: Record<string, { color: string; icon: string }> = {
  'Financiamento': { color: '#2ecc71', icon: '💰' },
  'Bolsa de Estudo': { color: '#3498db', icon: '🎓' },
  'Concurso': { color: '#e67e22', icon: '🏆' },
  'Aceleração': { color: '#d4af37', icon: '🚀' },
  'Emprego': { color: '#9b59b6', icon: '💼' },
  'Edital': { color: '#e74c3c', icon: '📋' },
};

export default function HomeOpportunities() {
  const { language } = useLanguage();
  const [opps, setOpps] = useState<Opportunity[]>([]);

  useEffect(() => {
    fetch('/api/opportunities')
      .then(res => res.json())
      .then(data => {
        if (data.opportunities) setOpps(data.opportunities.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  if (opps.length === 0) return null;

  return (
    <section style={{
      padding: '5rem 2rem',
      background: '#000',
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
            color: '#2ecc71',
            background: 'rgba(46,204,113,0.08)',
            border: '1px solid rgba(46,204,113,0.25)',
            padding: '0.3rem 1rem',
            borderRadius: '50px',
            marginBottom: '1.25rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            💼 {language === 'pt' ? 'Oportunidades' : 'Opportunities'}
          </span>
          <h2 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 1rem'
          }}>
            {language === 'pt' ? 'Oportunidades em Destaque' : 'Featured Opportunities'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto', lineHeight: '1.7' }}>
            {language === 'pt'
              ? 'Editais, bolsas, financiamentos e concursos para acelerar o seu negócio em África.'
              : 'Grants, scholarships, funding and competitions to grow your business in Africa.'}
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
          {opps.map(opp => {
            const cat = catColors[opp.category] || { color: '#d4af37', icon: '📌' };
            return (
              <div key={opp._id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '1.5rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap' as const,
                transition: 'border-color 0.2s, transform 0.2s'
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}50`;
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: `${cat.color}15`,
                  border: `1px solid ${cat.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', flexShrink: 0
                }}>
                  {cat.icon}
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' as const }}>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' as const,
                      letterSpacing: '0.08em', color: cat.color,
                      background: `${cat.color}12`, padding: '0.2rem 0.65rem', borderRadius: '50px',
                      fontFamily: 'Outfit, sans-serif'
                    }}>{opp.category}</span>
                    {opp.location && (
                      <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>📍 {opp.location}</span>
                    )}
                  </div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '0 0 0.35rem' }}>
                    {opp.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', margin: 0, lineHeight: '1.6' }}>
                    {opp.description.slice(0, 120)}...
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
                  {opp.amount && (
                    <span style={{
                      fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 700,
                      color: cat.color, whiteSpace: 'nowrap' as const
                    }}>{opp.amount}</span>
                  )}
                  {opp.applyLink ? (
                    <a href={opp.applyLink} target="_blank" rel="noopener noreferrer" style={{
                      background: cat.color, color: '#000',
                      fontWeight: 700, fontSize: '0.8rem', padding: '0.5rem 1.25rem',
                      borderRadius: '50px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif',
                      whiteSpace: 'nowrap' as const
                    }}>
                      {language === 'pt' ? 'Candidatar →' : 'Apply →'}
                    </a>
                  ) : (
                    <Link href="/oportunidades" style={{
                      background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
                      fontWeight: 600, fontSize: '0.8rem', padding: '0.5rem 1.25rem',
                      borderRadius: '50px', textDecoration: 'none', fontFamily: 'Outfit, sans-serif',
                      border: '1px solid rgba(255,255,255,0.12)', whiteSpace: 'nowrap' as const
                    }}>
                      {language === 'pt' ? 'Ver Mais →' : 'See More →'}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/oportunidades" style={{
            display: 'inline-block',
            background: 'transparent',
            color: '#2ecc71',
            border: '1.5px solid rgba(46,204,113,0.4)',
            fontWeight: 700,
            fontSize: '0.9rem',
            padding: '0.85rem 2.5rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontFamily: 'Outfit, sans-serif'
          }}>
            {language === 'pt' ? 'Ver Todas as Oportunidades →' : 'View All Opportunities →'}
          </Link>
        </div>
      </div>
    </section>
  );
}
