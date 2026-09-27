'use client';

import { useState, useEffect } from 'react';
import styles from './OportunidadesPublic.module.css';

interface OpportunityItem {
  _id: string;
  title: string;
  amount: string;
  deadline: string;
  category: 'Edital' | 'Concurso' | 'Financiamento' | 'Bolsa' | 'Programa' | 'Vaga' | 'Parceiro' | 'Outro';
  description: string;
  applyLink: string;
  location?: string;
  country?: string;
  provider?: string;
}

interface OportunidadesClientProps {
  initialOpportunities: OpportunityItem[];
}

export default function OportunidadesClient({ initialOpportunities }: OportunidadesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedCountry, setSelectedCountry] = useState<string>('Todos');
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check membership status
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      
      // Check if user is a member of the club
      fetch('/api/clube/inscricoes')
        .then(res => res.json())
        .then(data => {
          if (data.inscricoes) {
            const membership = data.inscricoes.find((i: any) => 
              i.email?.toLowerCase() === userData.email?.toLowerCase() && 
              i.status === 'aprovado'
            );
            setIsMember(!!membership);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Helper countdown logic
  const getDeadlineBadge = (dateStr: string) => {
    try {
      const deadlineDate = new Date(dateStr);
      const now = new Date();
      // Set hours of both to 0 to compare days cleanly
      deadlineDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);

      const diffTime = deadlineDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return {
          text: 'Expirado',
          style: { background: 'rgba(231, 76, 60, 0.15)', color: '#e74c3c', border: '1px solid rgba(231, 76, 60, 0.3)' }
        };
      }
      if (diffDays === 0) {
        return {
          text: 'Expira hoje',
          style: { background: 'rgba(230, 126, 34, 0.2)', color: '#e67e22', border: '1px solid rgba(230, 126, 34, 0.4)' }
        };
      }
      if (diffDays === 1) {
        return {
          text: 'Último dia',
          style: { background: 'rgba(230, 126, 34, 0.2)', color: '#e67e22', border: '1px solid rgba(230, 126, 34, 0.4)' }
        };
      }
      if (diffDays <= 7) {
        return {
          text: `Faltam ${diffDays} dias`,
          style: { background: 'rgba(241, 196, 15, 0.15)', color: '#f1c40f', border: '1px solid rgba(241, 196, 15, 0.3)' }
        };
      }
      return {
        text: `Faltam ${diffDays} dias`,
        style: { background: 'rgba(46, 139, 87, 0.15)', color: '#2e8b57', border: '1px solid rgba(46, 139, 87, 0.3)' }
      };
    } catch {
      return {
        text: 'A definir',
        style: { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }
      };
    }
  };

  const formatDateLong = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Filter opportunities
  const filteredOpportunities = initialOpportunities.filter(opp => {
    const categoryMatch = selectedCategory === 'Todos' || opp.category === selectedCategory;
    const countryMatch = selectedCountry === 'Todos' || 
                        opp.country === selectedCountry || 
                        opp.location?.toLowerCase().includes(selectedCountry.toLowerCase()) ||
                        (selectedCountry === 'Todos' && !opp.country);
    return categoryMatch && countryMatch;
  });

  const categories = ['Todos', 'Edital', 'Concurso', 'Financiamento', 'Bolsa', 'Programa', 'Vaga', 'Parceiro'];
  const countries = ['Todos', 'Moçambique', 'Angola', 'Guiné-Bissau', 'São Tomé e Príncipe', 'Cabo Verde', 'Online'];

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Categoria:</span>
          {categories.map(cat => {
            const count = cat === 'Todos' 
              ? initialOpportunities.length 
              : initialOpportunities.filter(o => o.category === cat).length;
          
            return (
              <button
                key={cat}
                className={`${styles.filterBtn} ${selectedCategory === cat ? styles.activeFilterBtn : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'Todos' ? 'Todas' : cat} ({count})
              </button>
            );
          })}
        </div>
        
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>País:</span>
          {countries.map(country => (
            <button
              key={country}
              className={`${styles.filterBtn} ${selectedCountry === country ? styles.activeFilterBtn : ''}`}
              onClick={() => setSelectedCountry(country)}
            >
              {country}
            </button>
          ))}
        </div>

        <button 
          className={styles.publishBtn}
          onClick={() => setShowPublishModal(true)}
        >
          + Publicar Oportunidade
        </button>
      </div>

      <div className={styles.grid}>
        {filteredOpportunities.length === 0 ? (
          <div className={styles.empty}>
            <p>Nenhuma oportunidade encontrada nesta categoria no momento.</p>
          </div>
        ) : (
          filteredOpportunities.map(opp => {
            const badge = getDeadlineBadge(opp.deadline);
            return (
              <div key={opp._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryBadge}>{opp.category}</span>
                  <span className={styles.amount}>{opp.amount}</span>
                </div>

                <h3 className={styles.cardTitle}>{opp.title}</h3>
                <p className={styles.cardDesc}>{opp.description}</p>

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span>Prazo:</span>
                    <strong>{formatDateLong(opp.deadline)}</strong>
                    <span className={styles.countdown} style={badge.style}>{badge.text}</span>
                  </div>
                  {opp.provider && (
                    <div className={styles.metaItem}>
                      <span>Entidade:</span>
                      <span>{opp.provider}</span>
                    </div>
                  )}
                  {opp.location && (
                    <div className={styles.metaItem}>
                      <span>Formato/Local:</span>
                      <span>{opp.location}</span>
                    </div>
                  )}
                  {opp.country && opp.country !== 'Todos' && (
                    <div className={styles.metaItem}>
                      <span>País:</span>
                      <span>{opp.country}</span>
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => setSelectedOpp(opp)}>
                    Ver Detalhes
                  </button>
                  {opp.applyLink && (
                    <a href={opp.applyLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', textDecoration: 'none' }}>
                      Candidatar-se
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Opportunity Details Modal */}
      {selectedOpp && (
        <div className={styles.modalOverlay} onClick={() => setSelectedOpp(null)}>
          <div className={`${styles.modalContent} glass`} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setSelectedOpp(null)}>✕</button>

            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span className={styles.categoryBadge}>{selectedOpp.category}</span>
                <span className={styles.amount} style={{ fontSize: '1.05rem' }}>{selectedOpp.amount}</span>
              </div>
              <h2>{selectedOpp.title}</h2>
            </div>

            <div className={styles.cardMeta} style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
              <div className={styles.metaItem}>
                <span>Limite de Candidatura:</span>
                <strong>{formatDateLong(selectedOpp.deadline)}</strong>
                <span className={styles.countdown} style={getDeadlineBadge(selectedOpp.deadline).style}>
                  {getDeadlineBadge(selectedOpp.deadline).text}
                </span>
              </div>
              {selectedOpp.provider && (
                <div className={styles.metaItem}>
                  <span>Promotor da Oportunidade:</span>
                  <span>{selectedOpp.provider}</span>
                </div>
              )}
              {selectedOpp.location && (
                <div className={styles.metaItem}>
                  <span>Localização:</span>
                  <span>{selectedOpp.location}</span>
                </div>
              )}
              {selectedOpp.country && selectedOpp.country !== 'Todos' && (
                <div className={styles.metaItem}>
                  <span>País:</span>
                  <span>{selectedOpp.country}</span>
                </div>
              )}
            </div>

            <p className={styles.modalDescription}>{selectedOpp.description}</p>

            <div className={styles.modalFooter}>
              <button className="btn-outline" onClick={() => setSelectedOpp(null)}>Fechar</button>
              {selectedOpp.applyLink && (
                <a href={selectedOpp.applyLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
                  Ir para Formulário de Candidatura
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Publish Opportunity Modal */}
      {showPublishModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPublishModal(false)}>
          <div className={`${styles.modalContent} glass`} style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModalBtn} onClick={() => setShowPublishModal(false)}>✕</button>

            <div className={styles.modalHeader}>
              <h2>Publicar Oportunidade</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>
                {isMember ? 'Publicação gratuita para membros do Clube' : 'Taxa de publicação: 2.000 MT'}
              </p>
            </div>

            <form className={styles.publishForm} onSubmit={(e) => {
              e.preventDefault();
              alert('Funcionalidade de publicação com pagamento será implementada no endpoint /api/opportunities');
              setShowPublishModal(false);
            }}>
              <div className={styles.formField}>
                <label>Título da Oportunidade *</label>
                <input type="text" required placeholder="Ex: Bolsa de Estudo em Tecnologia" />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Categoria *</label>
                  <select required>
                    <option value="">Selecione...</option>
                    <option value="Edital">Edital</option>
                    <option value="Concurso">Concurso</option>
                    <option value="Financiamento">Financiamento</option>
                    <option value="Bolsa">Bolsa</option>
                    <option value="Programa">Programa</option>
                    <option value="Vaga">Vaga</option>
                    <option value="Parceiro">Parceiro</option>
                  </select>
                </div>
                <div className={styles.formField}>
                  <label>Valor/Montante *</label>
                  <input type="text" required placeholder="Ex: 5.000 USD ou N/A" />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>Prazo de Candidatura *</label>
                  <input type="date" required />
                </div>
                <div className={styles.formField}>
                  <label>País *</label>
                  <select required>
                    <option value="">Selecione...</option>
                    <option value="Moçambique">Moçambique</option>
                    <option value="Angola">Angola</option>
                    <option value="Guiné-Bissau">Guiné-Bissau</option>
                    <option value="São Tomé e Príncipe">São Tomé e Príncipe</option>
                    <option value="Cabo Verde">Cabo Verde</option>
                    <option value="Online">Online/Global</option>
                  </select>
                </div>
              </div>

              <div className={styles.formField}>
                <label>Descrição Detalhada *</label>
                <textarea rows={4} required placeholder="Descreva a oportunidade, requisitos, benefícios..." />
              </div>

              <div className={styles.formField}>
                <label>Link de Candidatura</label>
                <input type="url" placeholder="https://..." />
              </div>

              <div className={styles.formField}>
                <label>Nome da Organização *</label>
                <input type="text" required placeholder="Sua empresa ou organização" />
              </div>

              {!isMember && (
                <div className={styles.paymentNotice}>
                  <p>Taxa de publicação: <strong>2.000 MT</strong></p>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                    Membros do Clube dos Empreendedores publicam gratuitamente. 
                    <a href="/clube-empreendedores" style={{ color: '#ff6b00', textDecoration: 'underline' }}>
                      Aderir ao Clube
                    </a>
                  </p>
                </div>
              )}

              <div className={styles.formActions}>
                <button type="button" className="btn-outline" onClick={() => setShowPublishModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {isMember ? 'Publicar Gratuitamente' : 'Pagar e Publicar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
