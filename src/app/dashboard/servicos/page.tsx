'use client';

import { useEffect, useState } from 'react';
import styles from '../Dashboard.module.css';

export default function ServicosPage() {
  const [services, setServices] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Form inputs
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [timeline, setTimeline] = useState('Imediato');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch active services
      const sRes = await fetch('/api/services');
      const sData = await sRes.json();
      const loadedServices = sData.success ? sData.services : [];
      
      // Fallback services if database is empty/not connected
      if (loadedServices.length === 0) {
        setServices([
          { _id: '1', title: 'Consultoria e Mentoria de Negócios', price: 'Gratuito', category: 'Mentoria', description: 'Reuniões individuais com mentores especializados para estruturar o seu plano de negócios.' },
          { _id: '2', title: 'Criação de Web Site & Landing Page', price: 'Sob Orçamento', category: 'Tecnologia', description: 'Desenvolvimento de uma presença online profissional para divulgar a sua marca e atrair clientes.' },
          { _id: '3', title: 'Identidade Visual & Branding', price: 'Sob Orçamento', category: 'Design', description: 'Criação do logotipo, paleta de cores e diretrizes visuais completas da sua startup.' }
        ]);
      } else {
        setServices(loadedServices);
      }

      // 2. Fetch requests by user
      const rRes = await fetch('/api/requests');
      const rData = await rRes.json();
      if (rData.success) {
        setRequests(rData.requests);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setSubmitting(true);
    setMsg({ type: '', text: '' });

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name || 'Empreendedor',
          email: user.email || 'email@example.com',
          phone,
          service: selectedService.title,
          servicePrice: selectedService.price || 'Grátis',
          company,
          timeline,
          description
        })
      });

      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: 'Solicitação enviada com sucesso! Um administrador irá analisar e responder em breve.' });
        // Reset form
        setPhone('');
        setCompany('');
        setTimeline('Imediato');
        setDescription('');
        setShowModal(false);
        // Refresh requests list
        fetchData();
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao submeter solicitação.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro de conexão ao enviar pedido.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '3rem', color: '#fff' }}>A carregar serviços...</div>;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold">Serviços e Aceleração</h1>
        <p style={{ opacity: 0.7 }}>Solicite ferramentas, mentoria e apoio técnico para alavancar a sua startup.</p>
      </header>

      {msg.text && (
        <div style={{
          color: msg.type === 'success' ? '#2ecc71' : '#ff4d4d',
          background: msg.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 77, 77, 0.1)',
          padding: '1rem',
          borderRadius: '12px',
          border: `1px solid ${msg.type === 'success' ? 'rgba(46, 204, 113, 0.2)' : 'rgba(255, 77, 77, 0.2)'}`,
          marginBottom: '2rem'
        }}>
          {msg.text}
        </div>
      )}

      {/* Grid structure: Services Left, Request History Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
        
        {/* Available Services */}
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'Outfit', marginBottom: '1.5rem' }}>Serviços Disponíveis</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {services.map((s) => (
              <div key={s._id} className="glass" style={{ padding: '1.8rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700 }}>{s.category}</span>
                    <h3 style={{ color: '#fff', margin: '4px 0 0 0', fontSize: '1.15rem' }}>{s.title}</h3>
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(255,107,0,0.1)', padding: '4px 12px', borderRadius: '30px' }}>
                    {s.price}
                  </span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>{s.description}</p>
                <button 
                  className="btn-primary" 
                  style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.8rem', marginTop: '0.5rem' }}
                  onClick={() => {
                    setSelectedService(s);
                    setShowModal(true);
                  }}
                >
                  Solicitar este serviço
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Requests Submitted */}
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'Outfit', marginBottom: '1.5rem' }}>O Meu Histórico</h2>
          {requests.length === 0 ? (
            <div className="glass" style={{ padding: '2rem', borderRadius: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              Nenhum pedido de serviço submetido.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {requests.map((r) => (
                <div key={r._id} className="glass" style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{r.service}</strong>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: r.status === 'pendente' ? 'rgba(241,196,15,0.15)' : r.status === 'aprovado' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                      color: r.status === 'pendente' ? '#f1c40f' : r.status === 'aprovado' ? '#2ecc71' : '#e74c3c'
                    }}>
                      {r.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                    📅 {new Date(r.createdAt).toLocaleDateString('pt-PT')}
                  </div>
                  {r.notes && (
                    <div style={{ marginTop: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--primary)', borderLeft: '3px solid var(--primary)' }}>
                      <strong>Notas do Admin:</strong> {r.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal Popup */}
      {showModal && selectedService && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass" style={{ maxWidth: '550px', width: '100%', margin: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ff4d4d', fontSize: '1.5rem', cursor: 'pointer' }}
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontFamily: 'Outfit', marginBottom: '0.2rem' }}>Solicitar Serviço</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 700, margin: '0 0 1.5rem 0' }}>{selectedService.title}</p>

            <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>WhatsApp/Telefone *</label>
                  <input 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    required 
                    placeholder="+245..."
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Nome da Startup/Empresa</label>
                  <input 
                    value={company} 
                    onChange={e => setCompany(e.target.value)} 
                    placeholder="Minha startup"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Prazo Desejado</label>
                <select 
                  value={timeline} 
                  onChange={e => setTimeline(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="Imediato">Imediato (Nas próximas semanas)</option>
                  <option value="1 a 3 meses">1 a 3 meses</option>
                  <option value="Mais de 3 meses">Mais de 3 meses</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Descrição dos Requisitos *</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  required 
                  rows={4}
                  placeholder="Descreva as suas necessidades de forma detalhada..."
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: '#fff', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: '0.5rem' }}>
                {submitting ? 'A submeter...' : 'Enviar Solicitação'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
