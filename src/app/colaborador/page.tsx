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
    // Fetch stats for collaborator
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
    { title: 'Total Usuários', value: stats.totalUsers, icon: '👥', color: '#3498db' },
    { title: 'Atividades Ativas', value: stats.activeActivities, icon: '🎯', color: '#2ecc71' },
    { title: 'Eventos', value: stats.upcomingEvents, icon: '📅', color: '#e67e22' },
    { title: 'Programas Ativos', value: stats.activePrograms, icon: '🚀', color: '#9b59b6' },
    { title: 'Mensagens', value: stats.messages, icon: '💬', color: '#f39c12' },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.welcomeSection}>
        <h1 className="text-gradient-gold">Bem-vindo ao Painel Colaborador</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>
          Gerencia as atividades e interações com a comunidade ABN
        </p>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((card, idx) => (
          <div key={idx} className={styles.statCard} style={{ borderColor: `${card.color}33` }}>
            <div className={styles.statIcon} style={{ background: `${card.color}22`, color: card.color }}>
              {card.icon}
            </div>
            <div className={styles.statContent}>
              <h3>{card.title}</h3>
              <div className={styles.statValue}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.recentActivity}>
        <h3 style={{ marginBottom: '1.5rem', fontFamily: 'Outfit' }}>Atividade Recente</h3>
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '16px', 
          background: '#161616', 
          border: '1px solid rgba(255,255,255,0.08)' 
        }}>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            Utilize o menu lateral para acessar as diferentes funcionalidades disponíveis.
          </p>
        </div>
      </div>
    </div>
  );
}
