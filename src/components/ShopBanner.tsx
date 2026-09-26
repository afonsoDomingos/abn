'use client';

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import styles from './ShopBanner.module.css';

interface ShopBannerProps {
  shopEnabled?: boolean;
}

export default function ShopBanner({ shopEnabled = false }: ShopBannerProps) {
  return (
    <section className={styles.shopBanner}>
      <div className={styles.shopBannerContent}>
        <div className={styles.shopBannerText}>
          <div className={styles.shopBadge}>
            <ShoppingBag size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            <span>LOJA ABN</span>
          </div>
          <h2 className={styles.shopTitle}>
            Produtos e Serviços para Empreendedores
          </h2>
          <p className={styles.shopDescription}>
            Descubra cursos, materiais de formação e ferramentas para impulsionar o seu negócio.
          </p>
          <Link 
            href="/loja" 
            className={`btn-primary ${styles.shopCta}`}
          >
            Explorar Loja
          </Link>
        </div>
      </div>
    </section>
  );
}