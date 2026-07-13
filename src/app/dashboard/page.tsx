'use client';

import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const [userName, setUserName] = useState('Empreendedor');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.name) {
          setUserName(parsed.name);
        }
      } catch (e) {}
    }
  }, []);

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcome}>
        <h1>Olá, <span className="text-gradient-gold">{userName}</span>!</h1>
        <p>Bem-vindo ao seu painel de crescimento. Aqui está o progresso do seu projeto.</p>
      </div>

      <div className={styles.progressGrid}>
        <div className={`${styles.progressCard} glass`}>
          <h3>Incubação</h3>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: '65%' }}></div>
          </div>
          <p>65% concluído - Fase de Validação</p>
        </div>
        
        <div className={`${styles.progressCard} glass`}>
          <h3>Site & Portfólio</h3>
          <p style={{ color: 'var(--primary)' }}>Em desenvolvimento</p>
          <button className="btn-outline" style={{ marginTop: '1rem', padding: '8px 16px', fontSize: '0.8rem' }}>Ver Draft</button>
        </div>
      </div>

      <div className={styles.sectionTitle}>
        <h2>Próximos Passos</h2>
      </div>

      <div className={styles.tasks}>
        <div className={styles.taskItem}>
          <input type="checkbox" checked readOnly />
          <span>Definição do Modelo de Negócio</span>
        </div>
        <div className={styles.taskItem}>
          <input type="checkbox" />
          <span>Mentoria com Especialista em Finanças</span>
        </div>
        <div className={styles.taskItem}>
          <input type="checkbox" />
          <span>Lançamento da Landing Page</span>
        </div>
      </div>

      <div className={styles.sectionTitle}>
        <h2>Recursos Recomendados</h2>
      </div>

      <div className={styles.resources}>
        <div className={`${styles.resourceCard} glass`}>
          <div className={styles.resourceIcon}>🎬</div>
          <h4>Como Atrair Investidores</h4>
          <p>Workshop em vídeo - 45 min</p>
        </div>
        <div className={`${styles.resourceCard} glass`}>
          <div className={styles.resourceIcon}>📄</div>
          <h4>Template de Business Plan</h4>
          <p>Documento Estruturado</p>
        </div>
      </div>
    </div>
  );
}
