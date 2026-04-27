'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.css';

export default function FAQ() {
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

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.faq_content) {
          setFaqs(data.configs.faq_content);
        }
      });
  }, []);

  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className="text-gradient-gold">Perguntas Frequentes</h2>
          <p>Tudo o que precisa de saber sobre a nossa rede e serviços.</p>
        </div>
        <div className={styles.list}>
          {faqs.map((faq, i) => (
            <div key={i} className={`${styles.item} glass`}>
              <button 
                className={styles.question}
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              >
                <span>{faq.question}</span>
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
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
