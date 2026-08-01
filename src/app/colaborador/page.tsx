'use client';

import { useEffect, useState } from 'react';
import styles from './Colaborador.module.css';

export default function ColaboradorDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeActivities: 0,
    upcomingEvents: 0,
    activePrograms: 0,
    messages: 0
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/atividades').then(r => r.json()),
      fetch('/api/eventos').then(r => r.json()),
      fetch('/api/programs').then(r => r.json()),
      fetch('/api/mensagens').then(r => r.json()),
    ]).then(([usersData, atividadesData, eventosData, programsData, messagesData]) => {
      setStats({
        totalUsers: usersData.users?.length || 0,
        activeActivities: atividadesData.atividades?.filter((a: any) => a.status === 'ativo').length || 0,
        upcomingEvents: eventosData.eventos?.length || 0,
        activePrograms: programsData.programs?.filter((p: any) => p.status === 'ativo').length || 0,
        messages: messagesData.mensagens?.length || 0,
      });
    }).catch(err => console.error(err));
  }, []);

  const statCards = [
    { title: 'Total Usuários', value: stats.totalUsers, color: '#3498db' },
    { title: 'Atividades Ativas', value: stats.activeActivities, color: '#2ecc71' },
    { title: 'Eventos', value: stats.upcomingEvents, color: '#e67e22' },
    { title: 'Programas Ativos', value: stats.activePrograms, color: '#9b59b6' },
    { title: 'Mensagens', value: stats.messages, color: '#f39c12' },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeSection}>
        <h1 className="text-gradient-gold">Bem-vindo ao Painel Colaborador</h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
          Gerencia as atividades e interações com a comunidade ABN
        </p>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((card, idx) => (
          <div key={idx} className={styles.statCard} style={{ borderColor: `${card.color}33` }}>
            <div className={styles.statIcon} style={{ background: `${card.color}22`, color: card.color }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: card.color }}></div>
            </div>
            <div className={styles.statContent}>
              <h3>{card.title}</h3>
              <div className={styles.statValue}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.recentActivity}>
        <h3 style={{ marginBottom: '1.5rem', fontFamily: 'Outfit', color: '#1e293b' }}>Atividade Recente</h3>
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '16px', 
          background: '#ffffff', 
          border: '1px solid #e8eaf0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <p style={{ color: '#64748b' }}>
            Utilize o menu lateral para acessar as diferentes funcionalidades disponíveis.
          </p>
        </div>
      </div>
    </div>
  );
}
