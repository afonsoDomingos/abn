'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import styles from './Contacto.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1>Fale Connosco</h1>
            <p>Estamos aqui para ajudar o seu negócio a crescer em África.</p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2>Informações de Contacto</h2>
              <p>Tem alguma dúvida sobre os nossos serviços de incubação, aceleração ou marketplace? Entre em contacto!</p>
              
              <div className={styles.infoItems}>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📍</span>
                  <div>
                    <strong>Localização</strong>
                    <p>Maputo, Moçambique</p>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.icon}>✉️</span>
                  <div>
                    <strong>Email</strong>
                    <a href="mailto:info@afrobiznetwork.com">info@afrobiznetwork.com</a>
                  </div>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📞</span>
                  <div>
                    <strong>WhatsApp / Telefone</strong>
                    <a href="https://wa.me/258845773974" target="_blank" rel="noopener noreferrer">+258 84 577 3974</a>
                  </div>
                </div>

                <div className={styles.infoItem} style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <span className={styles.icon}>💳</span>
                  <div>
                    <strong>Dados de Pagamento Oficial</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', lineHeight: '1.5', opacity: 0.9 }}>
                      <strong>Titular:</strong> Lizi Cristina Mulambo<br />
                      🏦 <strong>Millennium BIM:</strong> Conta 5283397 | NIB 0001 000000005283397 57<br />
                      🏦 <strong>Moza Banco:</strong> Conta 0087656640001 | NIB 0034 000008765664101 25<br />
                      📱 <strong>M-Pesa:</strong> 857670109 | 📱 <strong>e-Mola:</strong> 876687082
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.contactForm}>
              <h2>Envie uma Mensagem</h2>
              
              {status === 'success' ? (
                <div className={styles.successBox}>
                  <span className={styles.successIcon}>✅</span>
                  <h3>Mensagem Enviada!</h3>
                  <p>Agradecemos o seu contacto. A nossa equipa responderá em breve.</p>
                  <button className="btn-primary" onClick={() => setStatus('idle')} style={{marginTop: '1rem'}}>Enviar nova mensagem</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Nome Completo</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Introduza o seu nome"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="Introduza o seu email"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Mensagem</label>
                    <textarea 
                      required 
                      rows={5}
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="Como podemos ajudar?"
                    ></textarea>
                  </div>
                  
                  {status === 'error' && (
                    <div className={styles.errorMsg}>
                      Ocorreu um erro ao enviar. Por favor, tente novamente ou contacte-nos por WhatsApp.
                    </div>
                  )}
                  
                  <button type="submit" className="btn-primary" disabled={status === 'loading'} style={{width: '100%', marginTop: '1rem'}}>
                    {status === 'loading' ? 'A Enviar...' : 'Enviar Mensagem'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <FloatingWhatsApp />
      <ScrollToTop />
    </>
  );
}
