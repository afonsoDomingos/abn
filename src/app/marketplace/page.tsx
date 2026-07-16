'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import styles from './Marketplace.module.css';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  status: string;
}

const categoryIcons: Record<string, string> = {
  'Marketing Digital': '📣',
  'Incubação': '🚀',
  'Design': '🎨',
  'Consultoria': '💼',
  'Tecnologia': '💻',
};

export default function Marketplace() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [categories, setCategories] = useState<string[]>([]);

  const [bannerUrl, setBannerUrl] = useState('/partners_hero.png');

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.services) {
          setServices(data.services);
          const cats = ['Todos', ...Array.from(new Set<string>(data.services.map((s: Service) => s.category)))];
          setCategories(cats);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs?.page_banners?.marketplace) {
          setBannerUrl(data.configs.page_banners.marketplace);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = filter === 'Todos' ? services : services.filter(s => s.category === filter);

  return (
    <main className={styles.marketplace}>
      <Navbar />

      <header className={styles.header} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(10, 10, 10, 0.95) 100%), url('${bannerUrl}')` }}>
        <div className={styles.container}>
          <span className={styles.tag}>🛍️ Marketplace</span>
          <h1 className="text-gradient-gold">Serviços para o Seu Negócio</h1>
          <p>Encontre as melhores soluções para impulsionar a sua empresa em África.</p>
        </div>
      </header>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.filters}>
            {loading
              ? ['Todos', 'Marketing Digital', 'Incubação'].map(c => (
                  <button key={c} className={`${styles.filterBtn} ${c === 'Todos' ? styles.active : ''}`}>{c}</button>
                ))
              : categories.map(cat => (
                  <button
                    key={cat}
                    className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
                    onClick={() => setFilter(cat)}
                  >
                    {categoryIcons[cat] || '📌'} {cat}
                  </button>
                ))
            }
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {[1, 2, 3].map(i => <div key={i} className={styles.skeletonCard}></div>)}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <span>🔍</span>
              <p>Nenhum serviço encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((service, i) => (
                <div key={service._id} className={`${styles.card} glass`} style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className={styles.cardIcon}>
                    {categoryIcons[service.category] || '📌'}
                  </div>
                  <span className={styles.category}>{service.category}</span>
                  <h3 className={styles.cardTitle}>{service.name}</h3>
                  <p className={styles.cardDesc}>{service.description}</p>
                  <div className={styles.cardFooter}>
                    <div className={styles.priceBox}>
                      <span className={styles.priceLabel}>A partir de</span>
                      <span className={styles.price}>{service.price}</span>
                    </div>
                    <a
                      href={`https://wa.me/258845773974?text=Olá! Tenho interesse no serviço: ${encodeURIComponent(service.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn-primary ${styles.ctaBtn}`}
                    >
                      Contratar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FloatingWhatsApp />
    </main>
  );
}
