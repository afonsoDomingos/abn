'use client';

import { useEffect, useState } from 'react';
import styles from './Articles.module.css';
import { useLanguage } from '@/lib/LanguageContext';

export default function Articles() {
  const { t, language } = useLanguage();
  const [articles, setArticles] = useState([
    {
      type: 'news',
      location: 'Moçambique',
      title: 'Orange Corners Moçambique: Dia do Embaixador',
      date: '02/06/2026',
      desc: 'Nossos embaixadores estudantis desempenham um papel fundamental na conexão do Orange Corners com estudantes universitários, inspirando curiosidade...',
      img: '/articles/ambassador-day.png'
    },
    {
      type: 'photos',
      location: 'Moçambique',
      title: 'Fotos do Orange Corners Moçambique: Gala do Empreendedorismo',
      date: '28/11/2025',
      desc: 'No início deste mês, o Orange Corners Entrepreneurship Gala, em Moçambique, reuniu ex-alunos de todo o país...',
      img: '/articles/gala.png'
    },
    {
      type: 'article',
      location: 'Moçambique',
      title: 'Nilza Mazive e Xiphefu: energia inteligente para impulsionar o futuro de Moçambique',
      date: '25/08/2025',
      desc: 'Num país onde apenas cerca de 40% da população tem acesso à eletricidade, poupar energia...',
      img: '/articles/nilza.png'
    }
  ]);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.articles_content) {
          setArticles(data.configs.articles_content);
        }
      });
  }, []);

  // Map article type to badge style class
  const badgeStyleMap: Record<string, string> = {
    news: styles.badgeNews,
    photos: styles.badgePhotos,
    article: styles.badgeArticle
  };

  return (
    <section className={styles.section} id="artigos">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>{t.articles?.badge || 'Artigos'}</span>
          <h2 className={styles.title}>{t.articles?.title}</h2>
          <p className={styles.subtitle}>{t.articles?.subtitle}</p>
        </div>

        <div className={styles.grid}>
          {articles.map((item: any, index: number) => {
            const translated = language !== 'pt' && t.articles?.items?.[index] ? t.articles.items[index] : null;
            const title = translated ? translated.title : item.title;
            const desc = translated ? translated.desc : item.desc;
            const location = translated ? translated.location : item.location;
            
            const imgPath = item.img || '/articles/ambassador-day.png';
            const badgeClass = badgeStyleMap[item.type] || styles.badgeNews;
            const typeLabel = t.articles?.types?.[item.type] || item.type;

            return (
              <article key={index} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <span className={`${styles.typeBadge} ${badgeClass}`}>
                    {typeLabel}
                  </span>
                  <img 
                    src={imgPath} 
                    alt={title} 
                    className={styles.image} 
                    loading="lazy"
                  />
                </div>
                <div className={styles.content}>
                  <span className={styles.location}>{location}</span>
                  <h3 className={styles.articleTitle}>{title}</h3>
                  <span className={styles.date}>{item.date}</span>
                  <p className={styles.desc}>{desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
