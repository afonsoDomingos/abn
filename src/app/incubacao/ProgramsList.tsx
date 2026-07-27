'use client';

import { useState } from 'react';
import styles from './Incubacao.module.css';

interface Program {
  _id: string;
  title: string;
  description: string;
  publicoAlvo?: string;
  beneficios?: string;
  requisitos?: string;
  investimento?: string;
  processoSelecao?: string;
  criteriosSelecao?: string;
  phase?: string;
  duration?: string;
  image?: string;
  status: string;
  order: number;
}

interface ProgramsListProps {
  initialPrograms: Program[];
}

export default function ProgramsList({ initialPrograms }: ProgramsListProps) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idea, setIdea] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Filter out inactive programs for the public page
  const activePrograms = initialPrograms.filter(p => p.status !== 'inativo');

  const handleOpenDetails = (prog: Program) => {
    setSelectedProgram(prog);
    setShowApplyForm(false);
    setSuccess(false);
    setErrorMsg('');
    setName('');
    setEmail('');
    setPhone('');
    setIdea('');
  };

  const handleClose = () => {
    setSelectedProgram(null);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    if (!name.trim() || !email.trim() || !phone.trim() || !idea.trim()) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const formattedMessage = `[CANDIDATURA AO PROGRAMA: ${selectedProgram.title}]\n\nWhatsApp/Telefone: ${phone}\n\nIdeia/Negócio:\n${idea}`;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message: formattedMessage
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setErrorMsg(data.error || 'Erro ao submeter candidatura. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro de conexão. Por favor, verifique a sua rede.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderBulletList = (text?: string) => {
    if (!text) return null;
    return (
      <ul className={styles.detailList}>
        {text.split('\n').map((line, idx) => {
          if (!line.trim()) return null;
          // Strip leading bullet characters if present
          const cleanLine = line.trim().replace(/^[-•*]\s*/, '');
          return <li key={idx}>{cleanLine}</li>;
        })}
      </ul>
    );
  };

  return (
    <>
      <div className={styles.programsContainer}>
        <div className={styles.grid}>
          {activePrograms.map((p) => (
            <div key={p._id} className={`${styles.programCard} glass`} style={{ overflow: 'hidden', padding: 0 }}>
              {p.image && (
                <div style={{ width: '100%', height: '180px', overflow: 'hidden' }}>
                  <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ padding: '1.5rem' }}>
                <div className={styles.cardHeader}>
                  <h3>{p.title}</h3>
                  {p.phase && <span className={styles.phaseBadge}>{p.phase}</span>}
                </div>
                <p className={styles.desc}>
                  {p.description.length > 160 ? `${p.description.substring(0, 160)}...` : p.description}
                </p>
                <div className={styles.meta}>
                  <span>⏱ {p.duration || 'Contínuo'}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleOpenDetails(p)}>
                      Saber Mais
                    </button>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => { handleOpenDetails(p); setShowApplyForm(true); }}>
                      Candidatar-se
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Details / Application Modal */}
      {selectedProgram && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={`${styles.modalContent} glass`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={handleClose}>✕</button>
            
            {!showApplyForm ? (
              <div className={styles.detailsView}>
                <div className={styles.modalHeader}>
                  <div className={styles.badgeGroup}>
                    {selectedProgram.phase && <span className={styles.modalPhase}>{selectedProgram.phase}</span>}
                    {selectedProgram.duration && <span className={styles.modalDuration}>⏱ {selectedProgram.duration}</span>}
                  </div>
                  <h2 className="text-gradient-gold">{selectedProgram.title}</h2>
                </div>

                <div className={styles.modalBodyGrid}>
                  <div className={styles.modalLeftCol}>
                    <div className={styles.modalSection}>
                      <h4>O que é o programa?</h4>
                      <p className={styles.modalDescription}>{selectedProgram.description}</p>
                    </div>

                    {selectedProgram.publicoAlvo && (
                      <div className={styles.modalSection}>
                        <h4>Público-alvo</h4>
                        {renderBulletList(selectedProgram.publicoAlvo)}
                      </div>
                    )}

                    {selectedProgram.requisitos && (
                      <div className={styles.modalSection}>
                        <h4>Requisitos</h4>
                        {renderBulletList(selectedProgram.requisitos)}
                      </div>
                    )}
                  </div>

                  <div className={styles.modalRightCol}>
                    {selectedProgram.beneficios && (
                      <div className={styles.modalSection}>
                        <h4>Benefícios</h4>
                        {renderBulletList(selectedProgram.beneficios)}
                      </div>
                    )}

                    {selectedProgram.investimento && (
                      <div className={styles.modalSection}>
                        <h4>Investimento</h4>
                        <div className={styles.investBlock}>
                          {selectedProgram.investimento.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {(selectedProgram.processoSelecao || selectedProgram.criteriosSelecao) && (
                      <div className={styles.modalSection}>
                        <h4>Seleção & Admissão</h4>
                        {selectedProgram.processoSelecao && (
                          <div style={{ marginBottom: '1rem' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Processo:</strong>
                            {renderBulletList(selectedProgram.processoSelecao)}
                          </div>
                        )}
                        {selectedProgram.criteriosSelecao && (
                          <div>
                            <strong style={{ fontSize: '0.85rem', color: '#fff' }}>Critérios:</strong>
                            {renderBulletList(selectedProgram.criteriosSelecao)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.modalFooter}>
                  <button className="btn-outline" onClick={handleClose}>Fechar</button>
                  <button className="btn-primary" onClick={() => setShowApplyForm(true)}>Avançar para Candidatura</button>
                </div>
              </div>
            ) : (
              <div className={styles.applyFormView}>
                <h3 className="text-gradient-gold">Candidatura: {selectedProgram.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Preencha os seus dados para submeter a candidatura ao programa de incubação/aceleração.
                </p>

                {success ? (
                  <div className={styles.successScreen}>
                    <div className={styles.successIcon}>✓</div>
                    <h4>Candidatura Submetida!</h4>
                    <p>Obrigado pelo seu interesse. A equipa da ABN irá analisar a sua proposta e entrar em contacto muito em breve.</p>
                    <button className="btn-primary" onClick={handleClose} style={{ marginTop: '1.5rem' }}>Fechar Janela</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className={styles.applyForm}>
                    {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
                    
                    <div className={styles.formField}>
                      <label>Nome Completo *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Seu nome completo" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        disabled={submitting}
                      />
                    </div>

                    <div className={styles.formGridRow}>
                      <div className={styles.formField}>
                        <label>E-mail *</label>
                        <input 
                          type="email" 
                          required 
                          placeholder="seuemail@exemplo.com" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          disabled={submitting}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>WhatsApp / Telefone *</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="Ex: +258 84 123 4567" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          disabled={submitting}
                        />
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label>Apresente a sua Ideia ou Negócio *</label>
                      <span className={styles.labelHint}>Diga-nos brevemente o que faz o seu projeto, em que fase está e quais são as suas expectativas.</span>
                      <textarea 
                        required 
                        rows={5} 
                        placeholder="Descreva o seu projeto aqui..." 
                        value={idea} 
                        onChange={(e) => setIdea(e.target.value)} 
                        disabled={submitting}
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button type="button" className="btn-outline" onClick={() => setShowApplyForm(false)} disabled={submitting}>
                        Voltar aos Detalhes
                      </button>
                      <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? 'A submeter...' : 'Confirmar e Enviar'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
