'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function FAQ() {
  const { t, language } = useLanguage();
  const [faqs, setFaqs] = useState([
    {
      question: 'O que é a ABN – AfroBiz Network?',
      answer: 'A ABN é uma rede digital focada na incubação de startups e no desenvolvimento de PMEs em África, oferecendo ferramentas, mentoria e conexões estratégicas.'
    },
    {
      question: 'Como funciona o programa de incubação?',
      answer: 'O nosso programa divide-se em fases: Ideação, Validação, Crescimento e Escala. Cada fase tem marcos específicos e suporte personalizado de mentores especialistas.'
    },
    {
      question: 'Qualquer pessoa pode se juntar à rede?',
      answer: 'Sim, aceitamos empreendedores, startups, investidores e mentores que queiram contribuir para o ecossistema de negócios em África.'
    },
    {
      question: 'Como posso obter o website e portfólio grátis?',
      answer: 'Ao registar-se como PME na nossa plataforma, terá acesso automático à nossa oferta de lançamento que inclui 4 meses de presença digital profissional gratuita.'
    }
  ]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.faq_content) {
          setFaqs(data.configs.faq_content);
        }
      });
  }, []);

  const formLabels = {
    pt: {
      title: "Como podemos ajudar?",
      subtitle: "Envie-nos uma mensagem e responderemos o mais rápido possível.",
      name: "Nome Completo",
      email: "E-mail",
      message: "Mensagem",
      placeholderName: "Seu nome completo",
      placeholderEmail: "seu.email@exemplo.com",
      placeholderMessage: "Como podemos colaborar ou ajudar a sua empresa?",
      btn: "Enviar Mensagem",
      sending: "A enviar...",
      successTitle: "Mensagem Enviada!",
      successDesc: "Agradecemos o seu contacto. A nossa equipa irá responder-lhe muito em breve.",
      btnBack: "Enviar nova mensagem",
      error: "Por favor, preencha todos os campos obrigatórios."
    },
    en: {
      title: "How can we help?",
      subtitle: "Send us a message and we will get back to you as soon as possible.",
      name: "Full Name",
      email: "Email Address",
      message: "Message",
      placeholderName: "Your full name",
      placeholderEmail: "your.email@example.com",
      placeholderMessage: "How can we collaborate or help your business?",
      btn: "Send Message",
      sending: "Sending...",
      successTitle: "Message Sent!",
      successDesc: "Thank you for reaching out. Our team will get back to you very soon.",
      btnBack: "Send another message",
      error: "Please fill in all required fields."
    },
    fr: {
      title: "Comment aider ?",
      subtitle: "Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.",
      name: "Nom Complet",
      email: "Adresse E-mail",
      message: "Message",
      placeholderName: "Votre nom complet",
      placeholderEmail: "votre.email@exemple.com",
      placeholderMessage: "Comment pouvons-nous collaborer ou vous aider ?",
      btn: "Envoyer le Message",
      sending: "Envoi en cours...",
      successTitle: "Message Envoyé !",
      successDesc: "Merci de nous avoir contactés. Notre équipe vous répondra très bientôt.",
      btnBack: "Envoyer un autre message",
      error: "Veuillez remplir tous les champs obligatoires."
    }
  };

  const labels = formLabels[language as 'pt' | 'en' | 'fr'] || formLabels.pt;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg(labels.error);
      return;
    }
    setErrorMsg('');
    setStatus('submitting');

    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 1200));
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setErrorMsg('Erro na ligação. Tente novamente.');
      setStatus('idle');
    }
  };

  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>{t.faq.badge}</span>
          <h2 className="text-gradient-gold">{t.faq.title}</h2>
          <p>{t.faq.subtitle}</p>
        </div>
        
        <div className={styles.contentLayout}>
          <div className={styles.list}>
            {faqs.map((faq, i) => {
              const translated = language !== 'pt' && t.faq.items[i] ? t.faq.items[i] : null;
              return (
                <div key={i} className={`${styles.item} glass`}>
                  <button 
                    className={styles.question}
                    onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                  >
                    <span>{translated ? translated.q : faq.question}</span>
                    <span className={styles.plus}>{activeIndex === i ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence>
                    {activeIndex === i && (
                      <motion.div 
                        className={styles.answer}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{translated ? translated.a : faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className={`${styles.formContainer} glass`}>
            {status === 'success' ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✓</div>
                <h4>{labels.successTitle}</h4>
                <p>{labels.successDesc}</p>
                <button 
                  className="btn-secondary" 
                  style={{ marginTop: '1rem', width: '100%' }}
                  onClick={() => setStatus('idle')}
                >
                  {labels.btnBack}
                </button>
              </div>
            ) : (
              <>
                <div className={styles.formHeader}>
                  <h3>{labels.title}</h3>
                  <p>{labels.subtitle}</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.formField}>
                    <label>{labels.name}</label>
                    <input 
                      type="text" 
                      placeholder={labels.placeholderName}
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>{labels.email}</label>
                    <input 
                      type="email" 
                      placeholder={labels.placeholderEmail}
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      disabled={status === 'submitting'}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label>{labels.message}</label>
                    <textarea 
                      placeholder={labels.placeholderMessage}
                      rows={4}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      disabled={status === 'submitting'}
                    />
                  </div>

                  {errorMsg && <p className={styles.errorText} style={{ color: '#ff4d4d', fontSize: '0.85rem' }}>{errorMsg}</p>}

                  <button 
                    type="submit" 
                    className={`btn-primary ${styles.submitBtn}`}
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? labels.sending : labels.btn}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
