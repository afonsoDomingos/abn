'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Clock, MapPin, Users, Ticket, ArrowRight, Video } from 'lucide-react';

export default function DashboardEventosPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
      } else {
        // Fallback events
        setEvents([
          {
            _id: 'e1',
            title: 'Fórum Internacional de Empreendedorismo ABN',
            date: '15 de Agosto de 2026',
            time: '09:00 - 17:00',
            location: 'Maputo & Online (Zoom)',
            category: 'Fórum',
            description: 'Encontro anual de fundadores, investidores e mentores de negócios em África e na Diáspora.'
          },
          {
            _id: 'e2',
            title: 'Masterclass: Como Estruturar o Pitch para VC',
            date: '22 de Agosto de 2026',
            time: '15:00 - 17:00',
            location: 'Online (Webinar Exclusivo ABN Hub)',
            category: 'Masterclass',
            description: 'Workshop prático de apresentação de startups e métricas essenciais para captar financiamento.'
          },
          {
            _id: 'e3',
            title: 'Sessão B2B Networking & Pitching',
            date: '05 de Setembro de 2026',
            time: '10:00 - 13:00',
            location: 'Luanda & Online',
            category: 'Networking',
            description: 'Rodada de negócios e matchmaking direto entre membros do Clube dos Empreendedores.'
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', color: '#0f172a', fontWeight: 600 }}>A carregar eventos ABN...</div>;
  }

  return (
    <div style={{ maxWidth: '1050px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold" style={{ fontSize: '2rem', fontWeight: 800 }}>Eventos, Webinars &amp; Encontros B2B</h1>
        <p style={{ opacity: 0.9, color: '#475569', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5, marginTop: '0.4rem' }}>
          Participe nos encontros executivos, masterclasses e sessões de networking da AfroBiz Network.
        </p>
      </header>

      {/* Grid de Eventos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {events.map((ev) => (
          <div key={ev._id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', background: '#fff7ed', border: '1px solid #ffedd5', padding: '4px 10px', borderRadius: '20px' }}>
                {ev.category || 'Evento ABN'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 800, background: '#f0fdf4', padding: '3px 10px', borderRadius: '12px' }}>
                Inscrições Abertas
              </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'Outfit' }}>
              {ev.title}
            </h3>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              {ev.description}
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CalendarDays size={16} color="var(--primary)" />
                <strong>Data:</strong> {ev.date}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--primary)" />
                <strong>Horário:</strong> {ev.time}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} color="var(--primary)" />
                <strong>Local:</strong> {ev.location}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>🏛️ AfroBiz Network</span>
              <Link href="/eventos" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700 }}>
                Garantir Vaga <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
