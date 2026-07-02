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
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `Solicitação do Serviço: ${selectedService?.name}\n\nPreço/Info: ${selectedService?.price}`
        })
      });
      if (res.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '' });
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
        <div className={styles.modalOverlay} onClick={() => setSelectedService(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedService(null)}>&times;</button>
            <h3 className={styles.modalTitle}>Solicitar Serviço</h3>
            <p className={styles.modalSubtitle}>Serviço escolhido: <strong>{selectedService.name}</strong></p>
            
            {formStatus === 'success' ? (
              <div className={styles.successMessage}>
                <span className={styles.successIcon}>✅</span>
                <h4>Solicitação enviada!</h4>
                <p>A nossa equipa entrará em contacto brevemente.</p>
                <button className="btn-primary" onClick={() => setSelectedService(null)} style={{marginTop: '1rem', width: '100%'}}>Fechar</button>
              </div>
            ) : (
              <form onSubmit={handleRequest} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Nome Completo</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="O seu nome completo"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="O seu email principal"
                  />
                </div>
                
                {formStatus === 'error' && (
                  <div className={styles.errorMessage}>Ocorreu um erro ao enviar. Tente novamente.</div>
                )}
                
                <button type="submit" className="btn-primary" disabled={formStatus === 'loading'} style={{width: '100%', marginTop: '1rem'}}>
                  {formStatus === 'loading' ? 'A Enviar...' : 'Enviar Solicitação'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
