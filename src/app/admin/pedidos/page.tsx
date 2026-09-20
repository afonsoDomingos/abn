'use client';

import { useEffect, useState } from 'react';
import styles from './Pedidos.module.css';

interface Order {
  _id: string;
  productId: string;
  productName: string;
  productPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsApp: string;
  paymentMethod: string;
  total: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  kivoraPaymentId?: string;
  kivoraStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Pedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'failed'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.orders) {
        setOrders(data.orders);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'cancelled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>A carregar pedidos...</p>
      </div>
    );
  }

  return (
    <div className={styles.pedidos}>
      <div className={styles.header}>
        <h1>Gestão de Pedidos</h1>
        <button onClick={fetchOrders} className="btn-primary">
          🔄 Atualizar
        </button>
      </div>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({orders.length})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pendentes ({orders.filter(o => o.status === 'pending').length})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'paid' ? styles.active : ''}`}
          onClick={() => setFilter('paid')}
        >
          Pagos ({orders.filter(o => o.status === 'paid').length})
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'failed' ? styles.active : ''}`}
          onClick={() => setFilter('failed')}
        >
          Falhados ({orders.filter(o => o.status === 'failed').length})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className={styles.ordersGrid}>
          {filteredOrders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <span className={styles.orderId}>#{order._id.toString().slice(-8)}</span>
                <span
                  className={styles.status}
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className={styles.orderBody}>
                <h3 className={styles.productName}>{order.productName}</h3>
                <p className={styles.price}>Mt {order.total.toLocaleString()} MZN</p>

                <div className={styles.customerInfo}>
                  <p><strong>Cliente:</strong> {order.customerName}</p>
                  <p><strong>Email:</strong> {order.customerEmail}</p>
                  <p><strong>Telefone:</strong> {order.customerPhone}</p>
                  {order.customerWhatsApp && (
                    <p><strong>WhatsApp:</strong> {order.customerWhatsApp}</p>
                  )}
                  <p><strong>Método:</strong> {order.paymentMethod.toUpperCase()}</p>
                </div>

                <div className={styles.orderMeta}>
                  <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleDateString('pt-PT')}</p>
                  <p><strong>Hora:</strong> {new Date(order.createdAt).toLocaleTimeString('pt-PT')}</p>
                  {order.kivoraPaymentId && (
                    <p><strong>ID Kivora:</strong> {order.kivoraPaymentId}</p>
                  )}
                </div>
              </div>

              <div className={styles.orderActions}>
                {order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order._id, 'paid')}
                      className={`${styles.actionBtn} ${styles.approve}`}
                    >
                      ✅ Aprovar
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, 'cancelled')}
                      className={`${styles.actionBtn} ${styles.cancel}`}
                    >
                      ❌ Cancelar
                    </button>
                  </>
                )}
                {order.status === 'paid' && (
                  <button
                    onClick={() => window.open(`mailto:${order.customerEmail}`)}
                    className={`${styles.actionBtn} ${styles.email}`}
                  >
                    📧 Enviar Email
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
