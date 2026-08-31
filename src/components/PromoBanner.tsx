'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './PromoBanner.module.css';
import { useLanguage } from '@/lib/LanguageContext';

interface PromoItem {
    id: string;
    badge: string;
    title: string;
    description: string;
    link: string;
    ctaText: string;
}

export default function PromoBanner() {
    const { language } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const [promos, setPromos] = useState<PromoItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Check if dismissed in current session
        const isDismissed = sessionStorage.getItem('abn_promo_dismissed');
        if (isDismissed === 'true') return;

        // Load active programs & opportunities to build rotating array
        const loadPromos = async () => {
            const items: PromoItem[] = [];

            try {
                const res = await fetch('/api/programs');
                const data = await res.json();
                if (data.programs && data.programs.length > 0) {
                    data.programs.filter((p: any) => p.status === 'ativo').slice(0, 2).forEach((prog: any) => {
                        items.push({
                            id: prog._id,
                            badge: language === 'pt' ? 'Programa em Destaque' : 'Featured Program',
                            title: prog.title,
                            description: prog.description ? prog.description.slice(0, 105) + '...' : '',
                            link: `/programas/${prog._id}`,
                            ctaText: language === 'pt' ? 'Inscrever-me Agora →' : 'Apply Now →'
                        });
                    });
                }
            } catch (e) { }

            try {
                const resOpp = await fetch('/api/opportunities');
                const dataOpp = await resOpp.json();
                if (dataOpp.opportunities && dataOpp.opportunities.length > 0) {
                    const opp = dataOpp.opportunities[0];
                    items.push({
                        id: opp._id || 'opp-1',
                        badge: language === 'pt' ? 'Oportunidade & Bolsa' : 'Opportunity & Grant',
                        title: opp.title,
                        description: opp.description ? opp.description.slice(0, 105) + '...' : '',
                        link: '/oportunidades',
                        ctaText: language === 'pt' ? 'Ver Oportunidade →' : 'View Opportunity →'
                    });
                }
            } catch (e) { }

            // Add default high-converting promos if list is short
            items.push({
                id: 'clube-abn',
                badge: language === 'pt' ? 'Clube Empreendedores' : 'Entrepreneur Club',
                title: language === 'pt' ? 'Acesso Exclusivo à Rede ABN' : 'Exclusive Access to ABN Network',
                description: language === 'pt'
                    ? 'Conecte a sua startup a mentores internacionais, investidores e eventos V.I.P.'
                    : 'Connect your startup to international mentors, investors, and VIP events.',
                link: '/programas',
                ctaText: language === 'pt' ? 'Aderir ao Clube →' : 'Join the Club →'
            });

            setPromos(items);
        };

        loadPromos();

        // Show after 4 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 4000);

        return () => clearTimeout(timer);
    }, [language]);

    // Rotate through promos automatically every 6.5 seconds
    useEffect(() => {
        if (!isVisible || promos.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % promos.length);
        }, 6500);

        return () => clearInterval(interval);
    }, [isVisible, promos.length]);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('abn_promo_dismissed', 'true');
    };

    if (!isVisible || promos.length === 0) return null;

    const current = promos[currentIndex] || promos[0];

    return (
        <div className={styles.promoWrapper}>
            <div className={styles.promoCard}>
                {/* Resetting progress bar key triggers timer animation on each rotation */}
                <div key={currentIndex} className={styles.progressBar} />

                <div className={styles.topRow}>
                    <div className={styles.badge}>
                        <span className={styles.pulseDot} />
                        {current.badge}
                    </div>

                    <div className={styles.controlsRow}>
                        {promos.length > 1 && (
                            <div className={styles.dotsContainer}>
                                {promos.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        className={`${styles.dot} ${idx === currentIndex ? styles.dotActive : ''}`}
                                        onClick={() => setCurrentIndex(idx)}
                                        title={`Promoção ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                        <button
                            type="button"
                            className={styles.closeBtn}
                            onClick={handleDismiss}
                            aria-label="Fechar notificação"
                            title={language === 'pt' ? 'Fechar' : 'Close'}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    <h4 className={styles.title}>{current.title}</h4>
                    <p className={styles.description}>{current.description}</p>
                </div>

                <div className={styles.actions}>
                    <Link
                        href={current.link}
                        className={styles.ctaBtn}
                        onClick={handleDismiss}
                    >
                        {current.ctaText}
                    </Link>
                    <button
                        type="button"
                        className={styles.dismissBtn}
                        onClick={handleDismiss}
                    >
                        {language === 'pt' ? 'Mais Tarde' : 'Later'}
                    </button>
                </div>
            </div>
        </div>
    );
}
