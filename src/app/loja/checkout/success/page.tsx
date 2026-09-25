'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import styles from './Success.module.css';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [orderStatus, setOrderStatus] = useState<'pending' | 'paid' | 'failed'>('pending');
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    if (orderId) {
      // Poll for order status
      const checkStatus = async () => {
        try {
          const response = await fetch(`/api/orders/${orderId}`);
          const data = await response.json();
          
          if (data.order) {
            setOrder(data.order);
            setOrderStatus(data.order.status);
            
            if (data.order.status === 'paid') {
              setLoading(false);
            } else if (data.order.status === 'failed') {
              setLoading(false);
            }
          }
        } catch (error) {
          console.error('Error checking order status:', error);
        }
      };

      // Check immediately
      checkStatus();

      // Poll every 5 seconds
      const interval = setInterval(checkStatus, 5000);

      return () => clearInterval(interval);
    }
  }, [orderId]);

  const handleWhatsAppNotify = () => {
    if (!order) return;
    const phone = '258840000000'; // Número oficial de suporte/atendimento ABN
    const msg = `Olá ABN! Gostaria de confirmar meu pedido #${orderId}.\n\n` +
      `📦 Item: ${order.productName}\n` +
      `💰 Valor: ${order.total ? Number(order.total).toLocaleString() : order.productPrice} MT\n` +
      `👤 Cliente: ${order.customerName}\n` +
      `💳 Método: ${order.paymentMethod?.toUpperCase()}\n\n` +
      `Podem verificar o status da entrega/acesso?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!orderId) {
    return (
      <div className={styles.error}>
        <h2>Pedido não encontrado</h2>
        <button onClick={() => router.push('/loja')} className="btn-primary">
          Voltar à Loja
        </button>
      </div>
    );
  }

  return (
    <div className={styles.success}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.container}>
          {loading ? (
            <div className={styles.pendingState}>
              <div className={styles.spinner}></div>
              <h2>Aguardando Pagamento</h2>
              <p>O seu pedido está a ser processado. Por favor, aguarde...</p>
              <p className={styles.orderId}>Pedido #{orderId}</p>
              <div className={styles.info}>
                <p>Verifique o seu telemóvel para autorizar o pagamento.</p>
                <p>Esta página será atualizada automaticamente.</p>
              </div>
            </div>
          ) : orderStatus === 'paid' ? (
            <div className={styles.paidState}>
              <div className={styles.successIcon}>✅</div>
              <h2>Pagamento Confirmado!</h2>
              <p>Obrigado pela sua compra. O seu pedido foi processado com sucesso.</p>
              <p className={styles.orderId}>Pedido #{orderId}</p>
              
              <div className={styles.nextSteps}>
                <h3>Próximos Passos</h3>
                <ul>
                  <li>📧 Você receberá um email de confirmação</li>
                  <li>📦 Se for um produto digital, receberá o link de download</li>
                  <li>📱 Se for um serviço, entraremos em contacto via WhatsApp</li>
                </ul>
              </div>

              <div className={styles.actions} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', maxWidth: '380px', margin: '1.5rem auto 0' }}>
                <button 
                  onClick={handleWhatsAppNotify} 
                  style={{
                    background: '#25D366',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  💬 Confirmar no WhatsApp da ABN / Vendedor
                </button>
                <button onClick={() => router.push('/loja')} className="btn-primary">
                  Continuar a Comprar
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.failedState}>
              <div className={styles.errorIcon}>❌</div>
              <h2>Pagamento Falhou</h2>
              <p>Ocorreu um erro ao processar o seu pagamento. Por favor, tente novamente.</p>
              <p className={styles.orderId}>Pedido #{orderId}</p>
              
              <div className={styles.actions}>
                <button onClick={() => router.push('/loja')} className="btn-primary">
                  Voltar à Loja
                </button>
                <button 
                  onClick={() => router.push(`/loja/checkout?orderId=${orderId}`)}
                  className="btn-outline"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <FloatingWhatsApp />
    </div>
  );
}
