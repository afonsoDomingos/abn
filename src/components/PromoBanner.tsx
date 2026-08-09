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
    const [promo, setPromo] = useState<PromoItem | null>(null);

    useEffect(() => {
        // Check if dismissed in current session
        const isDismissed = sessionStorage.getItem('abn_promo_dismissed');
        if (isDismissed === 'true') return;

        // Load active programs or fallback to default promo
        fetch('/api/programs')
            .then(res => res.json())
            .then(data => {
                if (data.programs && data.programs.length > 0) {
                    const active = data.programs.find((p: any) => p.status === 'ativo') || data.programs[0];
                    setPromo({
                        id: active._id,
                        badge: language === 'pt' ? '🔥 Vagas Abertas' : '🔥 Open Applications',
                        title: active.title,
                        description: active.description ? active.description.slice(0, 100) + '...' : (language === 'pt' ? 'Acelere o seu negócio com mentoria e suporte ABN.' : 'Accelerate your business with ABN mentorship.'),
                        link: `/programas/${active._id}`,
                        ctaText: language === 'pt' ? 'Inscrever-me Agora →' : 'Apply Now →'
                    });
                } else {
                    setPromo(getDefaultPromo(language));
                }
            })
            .catch(() => {
                setPromo(getDefaultPromo(language));
            });

        // Show after 4 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 4000);

        return () => clearTimeout(timer);
    }, [language]);

    // Auto hide after 14 seconds of showing
    useEffect(() => {
        if (!isVisible) return;

        const autoHideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 14000);

        return () => clearTimeout(autoHideTimer);
    }, [isVisible]);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('abn_promo_dismissed', 'true');
    };

    if (!isVisible || !promo) return null;

    return (
        <div className={styles.promoWrapper}>
            <div className={styles.promoCard}>
                <div className={styles.progressBar} />

                <div className={styles.topRow}>
                    <div className={styles.badge}>
                        <span className={styles.pulseDot} />
                        {promo.badge}
                    </div>
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

                <div className={styles.content}>
                    <h4 className={styles.title}>{promo.title}</h4>
                    <p className={styles.description}>{promo.description}</p>
                </div>

                <div className={styles.actions}>
                    <Link
                        href={promo.link}
                        className={styles.ctaBtn}
                        onClick={handleDismiss}
                    >
                        {promo.ctaText}
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

function getDefaultPromo(lang: string): PromoItem {
    return {
        id: 'default',
        badge: lang === 'pt' ? '🚀 Oportunidade ABN' : '🚀 ABN Opportunity',
        title: lang === 'pt' ? 'Programa F-STARTUPS 180' : 'F-STARTUPS 180 Program',
        description: lang === 'pt'
            ? 'Acelere a sua ideia com mentoria especializada, workshops e rede de investidores.'
            : 'Accelerate your idea with specialized mentorship, workshops, and investor network.',
        link: '/programas',
        ctaText: lang === 'pt' ? 'Candidatar a Minha Startup →' : 'Apply My Startup →'
    };
}
