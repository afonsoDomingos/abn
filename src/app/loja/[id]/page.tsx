'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import styles from './ProductDetail.module.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: string;
  stock: number;
  digital: boolean;
  productType: 'digital' | 'physical' | 'service';
  fileSize?: string;
  duration?: string;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productId = params.id;
    if (productId) {
      fetch(`/api/products/${productId}`)
        .then(res => res.json())
        .then(data => {
          if (data.product) {
            setProduct(data.product);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching product:', err);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>A carregar...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.error}>
        <h2>Produto não encontrado</h2>
        <button onClick={() => router.push('/loja')} className="btn-primary">
          Voltar à Loja
        </button>
      </div>
    );
  }

  return (
    <div className={styles.productDetail}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <button 
            onClick={() => router.push('/loja')} 
            className={styles.backButton}
          >
            ← Voltar à Loja
          </button>

          <div className={styles.productGrid}>
            <div className={styles.productImageSection}>
              {product.image ? (
                <img src={product.image} alt={product.name} className={styles.productImage} />
              ) : (
                <div className={styles.placeholderImage}>
                  <span>📦</span>
                </div>
              )}
            </div>

            <div className={styles.productInfoSection}>
              <span className={styles.category}>{product.category}</span>
              <h1 className={styles.productName}>{product.name}</h1>
              <p className={styles.price}>Mt {product.price.toLocaleString()} MZN</p>
              
              <div className={styles.description}>
                <h3>Descrição</h3>
                <p>{product.description}</p>
              </div>

              <div className={styles.productMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Estado:</span>
                  <span className={styles.metaValue}>
                    {product.status === 'ativo' ? '✅ Disponível' : '❌ Indisponível'}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Tipo:</span>
                  <span className={styles.metaValue}>
                    {product.productType === 'digital' ? '📦 Produto Digital' :
                     product.productType === 'service' ? '🎯 Serviço' :
                     '📦 Produto Físico'}
                  </span>
                </div>
                {product.productType === 'physical' && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Stock:</span>
                    <span className={styles.metaValue}>
                      {product.stock > 0 ? `${product.stock} unidades` : 'Esgotado'}
                    </span>
                  </div>
                )}
                {product.productType === 'digital' && product.fileSize && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Tamanho:</span>
                    <span className={styles.metaValue}>{product.fileSize}</span>
                  </div>
                )}
                {product.productType === 'digital' && product.duration && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Duração:</span>
                    <span className={styles.metaValue}>{product.duration}</span>
                  </div>
                )}
              </div>

              <button
                className={`${styles.buyButton} btn-primary`}
                disabled={product.status !== 'ativo' || (product.productType === 'physical' && product.stock === 0)}
                onClick={() => router.push(`/loja/checkout?productId=${product._id}`)}
              >
                {product.status !== 'ativo' ? 'Indisponível' :
                 product.productType === 'physical' && product.stock === 0 ? 'Esgotado' :
                 'Comprar Agora'}
              </button>

              <div className={styles.trustBadges}>
                <div className={styles.trustBadge}>
                  <span>🔒</span>
                  <span>Compra 100% segura</span>
                </div>
                <div className={styles.trustBadge}>
                  <span>⚡</span>
                  <span>Entrega imediata</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingWhatsApp />
    </div>
  );
}
