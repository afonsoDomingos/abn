'use client';

import { useState } from 'react';
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
  provider?: string;
}

interface OportunidadesClientProps {
  initialOpportunities: OpportunityItem[];
}

export default function OportunidadesClient({ initialOpportunities }: OportunidadesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);

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
    if (selectedCategory === 'Todos') return true;
    return opp.category === selectedCategory;
  });

  const categories = ['Todos', 'Edital', 'Concurso', 'Financiamento', 'Bolsa', 'Programa', 'Vaga', 'Parceiro'];

  return (
    <>
      <div className={styles.filters}>
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

      <div className={styles.grid}>
        {filteredOpportunities.length === 0 ? (
          <div className={styles.empty}>
            <span>💼</span>
            <p>Nenhuma oportunidade encontrada nesta categoria no momento.</p>
          </div>
        ) : (
          filteredOpportunities.map(opp => {
            const badge = getDeadlineBadge(opp.deadline);
            return (
              <div key={opp._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryBadge}>{opp.category}</span>
                  <span className={styles.amount}>💰 {opp.amount}</span>
                </div>

                <h3 className={styles.cardTitle}>{opp.title}</h3>
                <p className={styles.cardDesc}>{opp.description}</p>

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span>📅 Prazo:</span>
                    <strong>{formatDateLong(opp.deadline)}</strong>
                    <span className={styles.countdown} style={badge.style}>{badge.text}</span>
                  </div>
                  {opp.provider && (
                    <div className={styles.metaItem}>
                      <span>🏢 Entidade:</span>
                      <span>{opp.provider}</span>
                    </div>
                  )}
                  {opp.location && (
                    <div className={styles.metaItem}>
                      <span>📍 Formato/Local:</span>
                      <span>{opp.location}</span>
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
                <span className={styles.amount} style={{ fontSize: '1.05rem' }}>💰 {selectedOpp.amount}</span>
              </div>
              <h2>{selectedOpp.title}</h2>
            </div>

            <div className={styles.cardMeta} style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
              <div className={styles.metaItem}>
                <span>📅 Limite de Candidatura:</span>
                <strong>{formatDateLong(selectedOpp.deadline)}</strong>
                <span className={styles.countdown} style={getDeadlineBadge(selectedOpp.deadline).style}>
                  {getDeadlineBadge(selectedOpp.deadline).text}
                </span>
              </div>
              {selectedOpp.provider && (
                <div className={styles.metaItem}>
                  <span>🏢 Promotor da Oportunidade:</span>
                  <span>{selectedOpp.provider}</span>
                </div>
              )}
              {selectedOpp.location && (
                <div className={styles.metaItem}>
                  <span>📍 Localização:</span>
                  <span>{selectedOpp.location}</span>
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
    </>
  );
}
