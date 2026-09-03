'use client';

import { useEffect, useState } from 'react';
import styles from '../Dashboard.module.css';

export default function ServicosPage() {
  const [services, setServices] = useState<any[]>([]);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'servicos' | 'marketplace'>('servicos');
  const [marketFilter, setMarketFilter] = useState<string>('todos');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isHiring, setIsHiring] = useState(false);
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
      
      if (loadedServices.length === 0) {
        setServices([
          { _id: '1', title: 'Consultoria e Mentoria de Negócios', price: 'Gratuito', category: 'Mentoria', description: 'Reuniões individuais com mentores especializados para estruturar o seu plano de negócios.' },
          { _id: '2', title: 'Criação de Web Site & Landing Page', price: 'Sob Orçamento', category: 'Tecnologia', description: 'Desenvolvimento de uma presença online profissional para divulgar a sua marca e atrair clientes.' },
          { _id: '3', title: 'Identidade Visual & Branding', price: 'Sob Orçamento', category: 'Design', description: 'Criação do logotipo, paleta de cores e diretrizes visuais completas da sua startup.' }
        ]);
      } else {
        setServices(loadedServices);
      }

      // 2. Fetch freelancers list
      const fRes = await fetch('/api/marketplace/freelancers');
      const fData = await fRes.json();
      if (fData.success) {
        setFreelancers(fData.freelancers);
      }

      // 3. Fetch requests by user
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

    // If hiring, title is formatted
    const serviceTitle = isHiring 
      ? `[Contratação Freelancer: ${selectedService.user.name}] - ${selectedService.category}`
      : selectedService.name;

    const price = isHiring ? selectedService.pricePerHour : (selectedService.price || 'Grátis');

    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name || 'Empreendedor',
          email: user.email || 'email@example.com',
          phone,
          service: serviceTitle,
          servicePrice: price,
          company,
          timeline,
          description
        })
      });

      const data = await res.json();
      if (data.success) {
        setMsg({ type: 'success', text: isHiring ? 'Pedido de contratação enviado! A ABN irá mediar a negociação e responder em breve.' : 'Solicitação enviada com sucesso! Um administrador irá analisar e responder em breve.' });
        setPhone('');
        setCompany('');
        setTimeline('Imediato');
        setDescription('');
        setShowModal(false);
        setIsHiring(false);
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

  const filteredFreelancers = marketFilter === 'todos' 
    ? freelancers 
    : freelancers.filter(f => f.category === marketFilter);

  if (loading) return <div style={{ padding: '3rem', color: '#0f172a', fontWeight: 600 }}>A carregar serviços...</div>;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 className="text-gradient-gold">Serviços e Marketplace</h1>
        <p style={{ opacity: 0.9, color: '#475569', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5, marginTop: '0.4rem' }}>
          Apoio de aceleração técnica do ABN Hub e contratação de especialistas no Marketplace (ABN recebe comissão).
        </p>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('servicos')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'servicos' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'servicos' ? 'var(--primary)' : '#64748b',
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          💼 Serviços ABN
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'marketplace' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'marketplace' ? 'var(--primary)' : '#64748b',
            padding: '10px 20px',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          🤝 Marketplace de Freelancers
        </button>
      </div>

      {msg.text && (
        <div style={{
          color: msg.type === 'success' ? '#15803d' : '#b91c1c',
          background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
          padding: '1rem',
          borderRadius: '12px',
          border: `1px solid ${msg.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          marginBottom: '2rem',
          fontWeight: 600
        }}>
          {msg.text}
        </div>
      )}

      {activeTab === 'servicos' ? (
        /* UI 1: ABN Platform Services */
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
          <div>
            <h2 style={{ color: '#0f172a', fontSize: '1.4rem', fontFamily: 'Outfit', marginBottom: '1.5rem', fontWeight: 800 }}>Serviços Disponíveis</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {services.map((s) => (
                <div key={s._id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)', padding: '1.8rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 800 }}>{s.category}</span>
                      <h3 style={{ color: '#0f172a', margin: '4px 0 0 0', fontSize: '1.15rem', fontWeight: 800 }}>{s.name}</h3>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)', background: 'rgba(255,107,0,0.1)', padding: '4px 12px', borderRadius: '30px' }}>
                      {s.price}
                    </span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>{s.description}</p>
                  <button 
                    className="btn-primary" 
                    style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.8rem', marginTop: '0.5rem', borderRadius: '10px' }}
                    onClick={() => {
                      setSelectedService(s);
                      setIsHiring(false);
                      setShowModal(true);
                    }}
                  >
                    Solicitar este serviço
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ color: '#0f172a', fontSize: '1.4rem', fontFamily: 'Outfit', marginBottom: '1.5rem', fontWeight: 800 }}>O Meu Histórico</h2>
            {requests.length === 0 ? (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '2rem', borderRadius: '20px', textAlign: 'center', color: '#64748b', fontStyle: 'italic', fontSize: '0.9rem' }}>
                Nenhum pedido de serviço submetido.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {requests.map((r) => (
                  <div key={r._id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15,23,42,0.03)', padding: '1.2rem', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{r.service}</strong>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: r.status === 'pendente' ? '#fef3c7' : r.status === 'aprovado' ? '#dcfce7' : '#fee2e2',
                        color: r.status === 'pendente' ? '#b45309' : r.status === 'aprovado' ? '#15803d' : '#b91c1c'
                      }}>
                        {r.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      📅 {new Date(r.createdAt).toLocaleDateString('pt-PT')}
                    </div>
                    {r.notes && (
                      <div style={{ marginTop: '0.5rem', background: '#fff7ed', padding: '8px', borderRadius: '8px', fontSize: '0.8rem', color: '#c2410c', borderLeft: '3px solid var(--primary)' }}>
                        <strong>Notas do Admin:</strong> {r.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* UI 2: Freelancers Marketplace */
        <div>
          {/* Sub category filter */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {['todos', 'Design', 'Tecnologia', 'Jurídico', 'Contabilidade', 'Marketing'].map(cat => (
              <button
                key={cat}
                onClick={() => setMarketFilter(cat)}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: '20px',
                  background: marketFilter === cat ? 'var(--primary)' : '#ffffff',
                  border: marketFilter === cat ? '1px solid var(--primary)' : '1px solid #cbd5e1',
                  color: marketFilter === cat ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {cat === 'todos' ? 'Ver Todos' : cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filteredFreelancers.map((free) => (
              <div key={free._id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(15,23,42,0.04)', padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={free.user?.profileImage || '/abn-logo.png'}
                    alt={free.user?.name || 'Freelancer'}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #e2e8f0'
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/abn-logo.png';
                      (e.currentTarget as HTMLImageElement).style.objectFit = 'contain';
                      (e.currentTarget as HTMLImageElement).style.padding = '6px';
                      (e.currentTarget as HTMLImageElement).style.background = '#fff7ed';
                    }}
                  />
                  <div>
                    <h3 style={{ color: '#0f172a', fontSize: '1.1rem', margin: 0, fontFamily: 'Outfit', fontWeight: 800 }}>{free.user?.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>💼 {free.category}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#d97706', marginBottom: '0.4rem', fontWeight: 700 }}>⭐ {free.rating.toFixed(1)} / 5.0</div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 800 }}>💸 {free.pricePerHour}</strong>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.4rem', fontWeight: 800 }}>Habilidades</h4>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {free.skills.map((skill: string, idx: number) => (
                      <span key={idx} style={{ background: '#f1f5f9', color: '#334155', fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {free.portfolio && free.portfolio.length > 0 && (
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.8rem', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '0.2rem' }}>📂 Portfólio Destaque</div>
                    <strong style={{ color: '#0f172a', fontWeight: 700 }}>{free.portfolio[0].title}</strong>
                    <p style={{ color: '#64748b', margin: '2px 0 0 0', lineHeight: 1.4 }}>{free.portfolio[0].description}</p>
                  </div>
                )}

                <button
                  className="btn-primary"
                  style={{ padding: '10px 0', fontSize: '0.85rem', width: '100%', marginTop: 'auto', borderRadius: '10px' }}
                  onClick={() => {
                    setSelectedService(free);
                    setIsHiring(true);
                    setShowModal(true);
                  }}
                >
                  Contratar Freelancer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Popup */}
      {showModal && selectedService && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: '#ffffff', maxWidth: '550px', width: '100%', margin: 'auto', padding: '2.5rem', borderRadius: '24px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <button 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', color: '#64748b', fontSize: '1.2rem', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 800 }}
              onClick={() => { setShowModal(false); setIsHiring(false); }}
            >
              ✕
            </button>
            <h2 style={{ color: '#0f172a', fontSize: '1.4rem', fontFamily: 'Outfit', marginBottom: '0.2rem', fontWeight: 800 }}>
              {isHiring ? 'Contratar Freelancer' : 'Solicitar Serviço'}
            </h2>
            <p style={{ color: 'var(--primary)', fontWeight: 800, margin: '0 0 1.5rem 0' }}>
              {isHiring ? `Proposta para: ${selectedService.user?.name}` : selectedService.name}
            </p>

            <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>WhatsApp/Telefone *</label>
                  <input 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    required 
                    placeholder="+258..."
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Nome da Startup/Empresa</label>
                  <input 
                    value={company} 
                    onChange={e => setCompany(e.target.value)} 
                    placeholder="Minha startup"
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>Prazo Desejado</label>
                <select 
                  value={timeline} 
                  onChange={e => setTimeline(e.target.value)}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', color: '#0f172a' }}
                >
                  <option value="Imediato">Imediato (Nas próximas semanas)</option>
                  <option value="1 a 3 meses">1 a 3 meses</option>
                  <option value="Mais de 3 meses">Mais de 3 meses</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  {isHiring ? 'Descrição do Trabalho / Requisitos *' : 'Descrição dos Requisitos *'}
                </label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  required 
                  rows={4}
                  placeholder={isHiring ? "Descreva as tarefas e o perfil de projeto que deseja que este freelancer execute..." : "Descreva as suas necessidades de forma detalhada..."}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px', borderRadius: '8px', color: '#0f172a', resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: '0.5rem', borderRadius: '10px', padding: '12px 0' }}>
                {submitting ? 'A submeter...' : 'Enviar Pedido de Contratação'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
