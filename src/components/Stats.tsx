'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Stats.module.css';
import { useLanguage } from '@/lib/LanguageContext';
import {
  Users,
  Briefcase,
  Globe2,
  TrendingUp,
  GraduationCap,
  Rocket,
  HandshakeIcon,
  Building2
} from 'lucide-react';

interface StatItem {
  value: string;
  label: string;
  iconKey?: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  users:     <Users     size={28} strokeWidth={1.8} />,
  business:  <Briefcase size={28} strokeWidth={1.8} />,
  globe:     <Globe2    size={28} strokeWidth={1.8} />,
  growth:    <TrendingUp size={28} strokeWidth={1.8} />,
  courses:   <GraduationCap size={28} strokeWidth={1.8} />,
  startups:  <Rocket    size={28} strokeWidth={1.8} />,
  partners:  <Building2 size={28} strokeWidth={1.8} />,
  default:   <TrendingUp size={28} strokeWidth={1.8} />,
};

const COLORS = ['#d4af37', '#3b82f6', '#10b981', '#f59e0b'];

const DEFAULT_STATS: StatItem[] = [
  { value: '...', label: 'Membros Registados',    iconKey: 'users'    },
  { value: '...', label: 'Negócios na Plataforma', iconKey: 'business' },
  { value: '...', label: 'Serviços Publicados',   iconKey: 'growth'   },
  { value: '...', label: 'Receita Processada',    iconKey: 'partners' },
];

export default function Stats() {
  const { language } = useLanguage();
  const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Try real platform data from /api/admin/stats
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.stats) {
          const real: StatItem[] = [
            {
              value: String(data.stats.totalUsers ?? '—'),
              label: language === 'pt' ? 'Membros Registados'     : 'Registered Members',
              iconKey: 'users',
            },
            {
              value: String(data.stats.totalStartups ?? '—'),
              label: language === 'pt' ? 'Negócios na Plataforma' : 'Businesses on Platform',
              iconKey: 'business',
            },
            {
              value: String(data.stats.activeServices ?? '—'),
              label: language === 'pt' ? 'Serviços Publicados'    : 'Published Services',
              iconKey: 'growth',
            },
            {
              value: data.stats.revenue ?? '—',
              label: language === 'pt' ? 'Receita Processada'     : 'Revenue Processed',
              iconKey: 'partners',
            },
          ];
          setStats(real);
          setLoaded(true);
        }
      })
      .catch(() => {
        // Fallback: try config-based stats
        fetch('/api/config')
          .then(res => res.json())
          .then(data => {
            if (data.configs?.stats_content) {
              setStats(data.configs.stats_content);
              setLoaded(true);
            }
          })
          .catch(() => {});
      });
  }, [language]);

  return (
    <section className={styles.statsSection} id="impacto">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>
            📊 {language === 'pt' ? 'Dados em Tempo Real' : 'Real-Time Data'}
          </span>
          <h2 className={styles.title}>
            {language === 'pt' ? 'Nosso Impacto' : 'Our Impact'}
          </h2>
          <p className={styles.subtitle}>
            {language === 'pt'
              ? 'Números reais da nossa plataforma de empreendedorismo'
              : 'Real numbers from our entrepreneurship platform'}
          </p>
        </div>

        <div className={styles.grid}>
          {stats.map((stat, i) => {
            const color = COLORS[i % COLORS.length];
            const icon = ICON_MAP[stat.iconKey ?? 'default'];
            return (
              <motion.div
                key={i}
                className={styles.statCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={styles.iconBox} style={{ background: `${color}14`, color }}>
                  {icon}
                </div>
                <div className={styles.value} style={{ color }}>
                  {!loaded && stat.value === '...'
                    ? <span className={styles.skeleton} />
                    : stat.value}
                </div>
                <div className={styles.label}>{stat.label}</div>
                <div className={styles.accentLine} style={{ background: color }} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
