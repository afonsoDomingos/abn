'use client';

import Link from 'next/link';
import { getClubStepTitle } from '@/lib/clubUtils';
import styles from './HomeClubeEmpreendedores.module.css';

export default function HomeClubeEmpreendedores() {

  return (
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
            <Link href="/clube-empreendedores" className={styles.btnPrimary}>
              Inscrever-me Agora
            </Link>
            <Link href="/clube-empreendedores" className={styles.btnSecondary}>
              Saber Mais 
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
  );
}
