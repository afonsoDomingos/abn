'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getClubStepTitle } from '@/lib/clubUtils';
import styles from './HomeClubeEmpreendedores.module.css';

export default function HomeClubeEmpreendedores() {
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [nivel, setNivel] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/clube/inscricoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeCompleto: nome, email, telefone, nivelAdesao: nivel, origem: 'home' }),
      });
    } catch {}
    setLoading(false);
    setSubmitted(true);
  };

  const close = () => { setShowModal(false); setSubmitted(false); setNome(''); setEmail(''); setNivel(''); setTelefone(''); };

  return (
    <>
      <section className={styles.section}>
        {/* Decorative background elements */}
        <div className={styles.bgDecor1} />
        <div className={styles.bgDecor2} />

        <div className={styles.container}>
          {/* Left — content */}
          <div className={styles.content}>
            <span className={styles.badge}>Programa em Destaque</span>
            <h2 className={styles.title}>
              Clube dos<br />
              <span className={styles.titleGold}>Empreendedores</span>
            </h2>
            <p className={styles.lema}>
              "Conectando mentes, impulsionando negócios e transformando África e o Mundo."
            </p>
            <p className={styles.desc}>
              A comunidade oficial e rede estratégica de colaboração, networking e capacitação da AfroBiz Network.
              Reúne empreendedores, inovadores e líderes para criar parcerias e acelerar negócios em África.
            </p>

            {/* Pillars */}
            <div className={styles.pillars}>
              <div className={styles.pillar}>
                <div>
                  <strong>Missão</strong>
                  <p>Fomentar o ecossistema empresarial conectando empreendedores e gerando oportunidades de investimento sustentável.</p>
                </div>
              </div>
              <div className={styles.pillar}>
                <div>
                  <strong>Visão</strong>
                  <p>Ser o maior e mais dinâmico clube de empreendedores de África.</p>
                </div>
              </div>
            </div>

            {/* Níveis rápidos */}
            <div className={styles.niveisRow}>
              {[
                { label: 'Jovem/Estudante', price: '300 MT' },
                { label: 'Individual', price: '500 MT' },
                { label: 'Empresa/PME', price: '1.500 MT' },
              ].map(n => (
                <div key={n.label} className={styles.nivelChip}>
                  <span className={styles.nivelLabel}>{n.label}</span>
                  <span className={styles.nivelPrice}>{n.price}</span>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <button className={styles.btnPrimary} onClick={() => setShowModal(true)}>
                Inscrever-me Agora
              </button>
              <Link href="/programas" className={styles.btnSecondary}>
                Saber Mais →
              </Link>
            </div>
          </div>

          {/* Right — stats card */}
          <div className={styles.statsCard}>
            <div className={styles.statsCardHeader}>
              <div>
                <p className={styles.statsCardTitle}>{getClubStepTitle('Clube dos Empreendedores')}</p>
                <p className={styles.statsCardSub}>ABN | AfroBiz Network</p>
              </div>
            </div>
            <div className={styles.statsGrid}>
              {[
                { val: 'Networking', desc: 'Encontros mensais' },
                { val: 'Formação', desc: 'Masterclasses' },
                { val: 'B2B', desc: 'Matchmaking' },
                { val: 'Investimento', desc: 'Acesso a capital' },
                { val: 'Nacional', desc: '& Internacional' },
                { val: 'Certificado', desc: 'de membro' },
              ].map(s => (
                <div key={s.val} className={styles.statItem}>
                  <span className={styles.statVal}>{s.val}</span>
                  <span className={styles.statDesc}>{s.desc}</span>
                </div>
              ))}
            </div>
            <div className={styles.statsCardFooter}>
              <span>Nacional &amp; Internacional</span>
              <span>Membro Contínuo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick-sign modal */}
      {showModal && (
        <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) close(); }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>🏛️ Inscrição Rápida</h3>
                <p className={styles.modalSub}>{getClubStepTitle('Clube dos Empreendedores')} — ABN</p>
              </div>
              <button className={styles.closeBtn} onClick={close}>✕</button>
            </div>

            {submitted ? (
              <div className={styles.success}>
                <div className={styles.successIcon}>✅</div>
                <h4>Inscrição recebida!</h4>
                <p>Obrigado, <strong>{nome}</strong>! A nossa equipa entrará em contacto brevemente. Para o inquérito completo visite a página de Programas.</p>
                <div className={styles.successActions}>
                  <Link href="/programas" className={styles.btnPrimary} onClick={close}>Ver Inquérito Completo</Link>
                  <button className={styles.btnSecondary} onClick={close}>Fechar</button>
                </div>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleQuickSubmit}>
                <p className={styles.formNote}>
                  Preencha os dados abaixo para expressar o seu interesse. Será contactado pela equipa ABN para formalizar a adesão.
                </p>
                <div className={styles.formField}>
                  <label htmlFor="hcn">Nome completo *</label>
                  <input id="hcn" type="text" required className={styles.input} placeholder="O seu nome" value={nome} onChange={e => setNome(e.target.value)} />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label htmlFor="hce">E-mail *</label>
                    <input id="hce" type="email" required className={styles.input} placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div className={styles.formField}>
                    <label htmlFor="hct">Telefone</label>
                    <input id="hct" type="tel" className={styles.input} placeholder="+258 ..." value={telefone} onChange={e => setTelefone(e.target.value)} />
                  </div>
                </div>
                <div className={styles.formField}>
                  <label htmlFor="hcl">Nível de Adesão *</label>
                  <select id="hcl" required className={styles.input} value={nivel} onChange={e => setNivel(e.target.value)}>
                    <option value="">Seleccione um nível...</option>
                    <option value="jovem">Jovem / Estudante — 300 MT inscrição | 1.000 MT/ano</option>
                    <option value="individual">Individual — 500 MT inscrição | 2.400 MT/ano</option>
                    <option value="empresa">Empresa / PME — 1.500 MT inscrição | 6.000 MT/ano</option>
                    <option value="corp-gold">Corporate Gold — 20.000 MT/ano</option>
                    <option value="corp-platinum">Corporate Platinum — 40.000 MT/ano</option>
                    <option value="corp-founding">Corporate Founding Partner — Pacote personalizado</option>
                    <option value="honorario">Honorário — Por convite da Direcção</option>
                  </select>
                </div>
                <div className={styles.formActions}>
                  <button type="button" className={styles.btnSecondary} onClick={close}>Cancelar</button>
                  <button type="submit" className={styles.btnPrimary} disabled={loading}>
                    {loading ? 'A enviar...' : 'Submeter Interesse ✓'}
                  </button>
                </div>
                <p className={styles.fullFormLink}>
                  Prefere o inquérito completo? <Link href="/programas" onClick={close}>Aceda aqui →</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
