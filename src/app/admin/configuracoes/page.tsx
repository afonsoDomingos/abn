'use client';

import { useEffect, useState } from 'react';
import styles from './Config.module.css';

export default function AdminConfigPage() {
  const [hero, setHero] = useState({ title: '', description: '' });
  const [stats, setStats] = useState([{ label: '', value: '' }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs) {
          if (data.configs.hero_content) setHero(data.configs.hero_content);
          if (data.configs.stats_content) setStats(data.configs.stats_content);
        }
        setLoading(false);
      });
  }, []);

  const saveConfig = async (key: string, value: any) => {
    setSaving(true);
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (res.ok) {
      setMsg(`✅ ${key === 'hero_content' ? 'Texto do Hero' : 'Estatísticas'} atualizado com sucesso!`);
      setTimeout(() => setMsg(''), 3000);
    }
    setSaving(false);
  };

  const updateStat = (index: number, field: 'label' | 'value', val: string) => {
    const newStats = [...stats];
    newStats[index][field] = val;
    setStats(newStats);
  };

  if (loading) return <div className={styles.loading}><div className={styles.spinner}></div></div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-gradient-gold">Configurações da Plataforma</h1>
        <p>Edite os textos principais e estatísticas que aparecem na Home.</p>
      </header>

      {msg && <div className={styles.toast}>{msg}</div>}

      <div className={styles.grid}>
        {/* Hero Section Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Seção Hero (Início)</h3>
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Título Principal</label>
              <input 
                value={hero.title} 
                onChange={e => setHero({ ...hero, title: e.target.value })}
                placeholder="Ex: Impulsionando Startups..."
              />
            </div>
            <div className={styles.field}>
              <label>Descrição</label>
              <textarea 
                rows={4}
                value={hero.description} 
                onChange={e => setHero({ ...hero, description: e.target.value })}
                placeholder="Descreva a missão da ABN..."
              />
            </div>
            <button 
              className="btn-primary" 
              onClick={() => saveConfig('hero_content', hero)}
              disabled={saving}
            >
              {saving ? 'A guardar...' : 'Atualizar Hero'}
            </button>
          </div>
        </section>

        {/* Stats Section Config */}
        <section className={`glass ${styles.section}`}>
          <h3>Estatísticas de Impacto</h3>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statEdit}>
                <div className={styles.field}>
                  <label>Rótulo (ex: Países)</label>
                  <input 
                    value={stat.label} 
                    onChange={e => updateStat(index, 'label', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Valor (ex: 12)</label>
                  <input 
                    value={stat.value} 
                    onChange={e => updateStat(index, 'value', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button 
            className="btn-primary" 
            onClick={() => saveConfig('stats_content', stats)}
            disabled={saving}
            style={{ marginTop: '1.5rem' }}
          >
            {saving ? 'A guardar...' : 'Atualizar Estatísticas'}
          </button>
        </section>
      </div>
    </div>
  );
}
