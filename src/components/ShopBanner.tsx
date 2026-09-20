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
            {shopEnabled 
              ? 'Produtos e Serviços para Empreendedores' 
              : 'Em Breve: Loja ABN'}
          </h2>
          <p className={styles.shopDescription}>
            {shopEnabled
              ? 'Descubra cursos, materiais de formação e ferramentas para impulsionar o seu negócio.'
              : 'Estamos a preparar uma plataforma completa de produtos e serviços para empreendedores.'}
          </p>
          <Link 
            href="/loja" 
            className={`btn-primary ${styles.shopCta}`}
          >
            {shopEnabled ? 'Explorar Loja' : 'Avisar-me'}
          </Link>
        </div>
        <div className={styles.shopBannerImage}>
          <img src="/bannerlojaabn.png" alt="Loja ABN Banner" />
        </div>
      </div>
    </section>
  );
}