'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import styles from './Checkout.module.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  productType: 'digital' | 'physical' | 'service';
  stock: number;
  digital: boolean;
  fileSize?: string;
  duration?: string;
}

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    paymentMethod: 'emola',
    phoneNumber: ''
  });

  const [buyTogether, setBuyTogether] = useState(false);
  const [additionalProduct, setAdditionalProduct] = useState<Product | null>(null);

  useEffect(() => {
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
  }, [productId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentMethodChange = (method: string) => {
    setFormData({
      ...formData,
      paymentMethod: method,
      phoneNumber: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

    const orderData = {
      productId: product._id,
      productName: product.name,
      productPrice: product.price,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phoneNumber,
      customerWhatsApp: formData.whatsapp,
      paymentMethod: formData.paymentMethod,
      buyTogether,
      total: buyTogether && additionalProduct 
        ? product.price + additionalProduct.price 
        : product.price
    };

    try {
      // Create order first
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        alert('Erro ao processar o pedido. Tente novamente.');
        return;
      }

      const orderDataResult = await orderResponse.json();
      
      // Redirect to success page (will poll for payment status)
      router.push(`/loja/checkout/success?orderId=${orderDataResult.orderId}`);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Erro ao processar o pedido. Tente novamente.');
    }
  };

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

  const totalPrice = buyTogether && additionalProduct 
    ? product.price + additionalProduct.price 
    : product.price;

  return (
    <div className={styles.checkout}>
      <Navbar />
      
      <main className={styles.checkoutMain}>
        <div className={styles.container}>
          <div className={styles.checkoutGrid}>
            {/* Left Side - Product Info */}
            <div className={styles.productSection}>
              <h1 className={styles.pageTitle}>Finalizar Compra</h1>
              
              <div className={styles.productCard}>
                {product.image && (
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                )}
                <div className={styles.productInfo}>
                  <h2 className={styles.productName}>{product.name}</h2>
                  <p className={styles.productCategory}>{product.category}</p>
                  <p className={styles.productDescription}>{product.description}</p>
                </div>
              </div>

              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>Mt {product.price.toLocaleString()} MZN</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Impostos</span>
                  <span>Grátis</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Tipo de Produto</span>
                  <span>
                    {product.productType === 'digital' ? '📦 Digital' :
                     product.productType === 'service' ? '🎯 Serviço' :
                     '📦 Físico'}
                  </span>
                </div>
                {product.productType === 'physical' && (
                  <div className={styles.summaryRow}>
                    <span>Stock Disponível</span>
                    <span>{product.stock} unidades</span>
                  </div>
                )}
                {buyTogether && additionalProduct && (
                  <div className={styles.summaryRow}>
                    <span>Produto Adicional</span>
                    <span>Mt {additionalProduct.price.toLocaleString()} MZN</span>
                  </div>
                )}
                <div className={styles.summaryRowTotal}>
                  <span>Total</span>
                  <span>Mt {totalPrice.toLocaleString()} MZN</span>
                </div>
              </div>

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

              <div className={styles.socialProof}>
                <span>+23 pessoas já compraram este produto!</span>
              </div>
            </div>

            {/* Right Side - Checkout Form */}
            <div className={styles.checkoutFormSection}>
              <form onSubmit={handleSubmit} className={styles.checkoutForm}>
                <h3 className={styles.formTitle}>Informações do Cliente</h3>
                
                <div className={styles.formGroup}>
                  <label htmlFor="name">Nome completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Digite seu email"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="whatsapp">WhatsApp (opcional)</label>
                  <div className={styles.phoneInput}>
                    <span className={styles.countryCode}>+258</span>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="84 123 4567"
                    />
                  </div>
                </div>

                <h3 className={styles.formTitle}>Método de Pagamento</h3>
                
                <div className={styles.paymentMethods}>
                  <button
                    type="button"
                    className={`${styles.paymentMethod} ${formData.paymentMethod === 'emola' ? styles.active : ''}`}
                    onClick={() => handlePaymentMethodChange('emola')}
                  >
                    <div className={styles.paymentIcon} style={{ color: '#00b140', fontSize: '2rem', fontWeight: 'bold' }}>e-Mola</div>
                    <span>e-Mola</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`${styles.paymentMethod} ${formData.paymentMethod === 'mpesa' ? styles.active : ''}`}
                    onClick={() => handlePaymentMethodChange('mpesa')}
                  >
                    <div className={styles.paymentIcon} style={{ color: '#00a4e4', fontSize: '2rem', fontWeight: 'bold' }}>M-Pesa</div>
                    <span>M-Pesa</span>
                  </button>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber">
                    {formData.paymentMethod === 'emola' ? 'Número e-Mola *' : 'Número M-Pesa *'}
                  </label>
                  <div className={styles.phoneInput}>
                    <span className={styles.countryCode}>+258</span>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="84 123 4567"
                    />
                  </div>
                </div>

                <button type="submit" className={`${styles.submitButton} btn-primary`}>
                  Finalizar Compra
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
              </form>
            </div>
          </div>
        </div>
      </main>

      <FloatingWhatsApp />
    </div>
  );
}
