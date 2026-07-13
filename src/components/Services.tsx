'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Services.module.css';
import { useLanguage } from '@/lib/LanguageContext';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  status: string;
}

export default function Services() {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    description: '',
    timeline: 'Imediato'
  });
  const [step, setStep] = useState(1);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const closeModal = () => {
    setSelectedService(null);
    setStep(1);
    setFormStatus('idle');
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: selectedService?.name || '',
          servicePrice: selectedService?.price || '',
          company: formData.company,
          timeline: formData.timeline,
          description: formData.description
        })
      });
      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', phone: '', company: '', description: '', timeline: 'Imediato' });
        setStep(1);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.services) {
          setServices(data.services.filter((s: any) => s.status === 'ativo').slice(0, 3));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || services.length === 0) return null;

  return (
    <section className={styles.section} id="marketplace">
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className={styles.badge}>{t.services.badge}</span>
          <h2 className={styles.title}>{t.services.title}</h2>
          <p className={styles.subtitle}>{t.services.subtitle}</p>
        </motion.div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <motion.div 
              key={service._id}
              className={`${styles.card} glass`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.category}>{service.category}</span>
                <div className={styles.dot}></div>
              </div>
              <h3 className={styles.serviceName}>{service.name}</h3>
              <p className={styles.description}>{service.description}</p>
              <div className={styles.footer}>
                <span className={styles.price}>{service.price}</span>
                <button className={styles.btn} onClick={() => setSelectedService(service)}>{t.services.request}</button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className={styles.more}>
          <button className="btn-outline">{t.services.viewAll}</button>
        </div>
      </div>

      {selectedService && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
            <h3 className={styles.modalTitle}>Solicitar Serviço</h3>
            <p className={styles.modalSubtitle}>Serviço escolhido: <strong>{selectedService.name}</strong></p>
            
            {formStatus === 'success' ? (
              <div className={styles.successMessage}>
                <div className={styles.successIconWrapper}>
                  <svg viewBox="0 0 52 52" className={styles.checkmark}>
                    <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
                    <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                  </svg>
                </div>
                <h4>Solicitação enviada! ✅</h4>
                <p>Recebemos o seu pedido. A nossa equipa entrará em contacto em breve via email ou WhatsApp.</p>
                <div style={{
                  marginTop: '1.2rem',
                  background: 'rgba(42,79,166,0.12)',
                  border: '1px solid rgba(42,79,166,0.3)',
                  borderRadius: '12px',
                  padding: '1rem 1.2rem',
                  textAlign: 'left'
                }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                    📊 Quer acompanhar o estado do pedido?
                  </p>
                  <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                    Crie uma conta gratuita em <strong style={{ color: '#fff' }}>abnafrobiznetwork.com/registro</strong> com o <strong style={{ color: '#fff' }}>mesmo email</strong> que usou neste formulário. No Dashboard → <strong style={{ color: '#fff' }}>Serviços</strong> poderá ver o estado em tempo real: Pendente → Em Análise → Aprovado.
                  </p>
                </div>
                <button className={styles.successCloseBtn} onClick={closeModal}>Fechar</button>
              </div>
            ) : (
              <div>
                {/* Step indicator */}
                <div className={styles.stepIndicator}>
                  <span className={step === 1 ? styles.activeStep : ''}>1. Contacto</span>
                  <span className={styles.stepLine}></span>
                  <span className={step === 2 ? styles.activeStep : ''}>2. Projeto</span>
                </div>

                {step === 1 ? (
                  <div className={styles.modalForm}>
                    <div className={styles.formGroup}>
                      <label>Nome Completo *</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="O seu nome completo"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email Principal *</label>
                      <input 
                        type="email" 
                        required 
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="O seu email principal"
                      />
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '5px', display: 'block', lineHeight: 1.5 }}>
                        📌 Use o mesmo email da sua conta ABN para acompanhar o estado do pedido no Dashboard.
                      </span>
                    </div>
                    <div className={styles.formGroup}>
                      <label>WhatsApp / Telefone *</label>
                      <input 
                        type="tel" 
                        required 
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="Ex: +258 84 123 4567"
                      />
                    </div>
                    <button 
                      type="button" 
                      className="btn-primary" 
                      onClick={() => {
                        if (!formData.name || !formData.email || !formData.phone) {
                          alert('Por favor, preencha todos os campos obrigatórios.');
                          return;
                        }
                        if (!formData.email.includes('@')) {
                          alert('Por favor, insira um email válido.');
                          return;
                        }
                        setStep(2);
                      }} 
                      style={{width: '100%', marginTop: '1rem'}}
                    >
                      Seguinte &rarr;
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRequest} className={styles.modalForm}>
                    <div className={styles.formGroup}>
                      <label>Nome da Empresa / Ideia (Opcional)</label>
                      <input 
                        type="text" 
                        value={formData.company}
                        onChange={e => setFormData({...formData, company: e.target.value})}
                        placeholder="Nome da sua startup ou ideia"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Expectativa de Início *</label>
                      <select 
                        value={formData.timeline}
                        onChange={e => setFormData({...formData, timeline: e.target.value})}
                        className={styles.selectInput}
                      >
                        <option value="Imediato">Imediato</option>
                        <option value="Em 15 dias">Em 15 dias</option>
                        <option value="Em 30 dias">Em 30 dias</option>
                        <option value="Apenas a sondar">Apenas a sondar</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Fale-nos mais sobre a sua necessidade *</label>
                      <textarea 
                        required 
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Descreva o que espera deste serviço..."
                      />
                    </div>
                    
                    {formStatus === 'error' && (
                      <div className={styles.errorMessage}>Ocorreu um erro ao enviar. Tente novamente.</div>
                    )}
                    
                    <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                      <button type="button" className="btn-secondary" onClick={() => setStep(1)} style={{flex: 1}}>
                        Voltar
                      </button>
                      <button type="submit" className="btn-primary" disabled={formStatus === 'loading'} style={{flex: 2}}>
                        {formStatus === 'loading' ? 'A Enviar...' : 'Enviar Solicitação'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
