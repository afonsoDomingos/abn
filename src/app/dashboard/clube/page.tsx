'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Check, Clock, AlertCircle, Download, Calendar, CreditCard, RefreshCw } from 'lucide-react';
import styles from './page.module.css';

type MembershipStatus = 'active' | 'pending' | 'expired' | 'cancelled';

interface Membership {
  _id: string;
  nivelAdesao: string;
  status: string;
  statusPagamento: string;
  dataAdesao: string;
  dataRenovacao?: string;
  valorPago: string;
  formaPagamento: string;
  comprovativoUrl?: string;
  tipoPagamento: string;
}

export default function ClubeDashboardPage() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMembership();
  }, []);

  const fetchMembership = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);
      const email = user.email;

      const res = await fetch('/api/clube/inscricoes');
      const data = await res.json();

      if (data.inscricoes && email) {
        const myMembership = data.inscricoes.find((i: any) => 
          i.email?.toLowerCase() === email.toLowerCase() && 
          i.status === 'aprovado'
        );
        
        if (myMembership) {
          setMembership(myMembership);
        }
      }
    } catch (e) {
      setError('Erro ao carregar dados de adesão.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string, paymentStatus: string) => {
    if (status === 'aprovado' && paymentStatus === 'pago') {
      return { status: 'active', label: 'Activo', color: '#22c55e', icon: Check };
    } else if (status === 'pendente') {
      return { status: 'pending', label: 'Pendente', color: '#f59e0b', icon: Clock };
    } else if (status === 'rejeitado') {
      return { status: 'cancelled', label: 'Cancelado', color: '#ef4444', icon: AlertCircle };
    } else {
      return { status: 'expired', label: 'Expirado', color: '#64748b', icon: AlertCircle };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getNivelLabel = (nivel: string) => {
    const labels: Record<string, string> = {
      'jovem': 'Jovem / Estudante',
      'individual': 'Individual',
      'empresa': 'Empresa / PME',
      'corp-gold': 'Corporate Gold',
      'corp-platinum': 'Corporate Platinum',
      'corp-founding': 'Corporate Founding Partner',
      'honorario': 'Honorário',
      'Geral': 'Geral'
    };
    return labels[nivel] || nivel;
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.loading}>A carregar dados...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!membership) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.noMembership}>
            <AlertCircle size={48} className={styles.alertIcon} />
            <h2>Ainda não é membro do Clube</h2>
            <p>Adira ao Clube dos Empreendedores para aceder a networking, mentoria e oportunidades exclusivas.</p>
            <Link href="/clube-empreendedores" className={styles.ctaBtn}>
              Aderir ao Clube
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusInfo = getStatusInfo(membership.status, membership.statusPagamento);

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.container}>
        <div className={styles.header}>
          <h1>Área de Membro</h1>
          <p>Gerencie a sua adesão ao Clube dos Empreendedores</p>
        </div>

        {/* Status Card */}
        <section className={styles.statusSection}>
          <div className={styles.statusCard}>
            <div className={styles.statusHeader}>
              <div className={styles.statusInfo}>
                <div className={styles.statusBadge} style={{ backgroundColor: statusInfo.color }}>
                  <statusInfo.icon size={20} />
                  {statusInfo.label}
                </div>
                <h2>{getNivelLabel(membership.nivelAdesao)}</h2>
              </div>
              <button className={styles.refreshBtn} onClick={fetchMembership}>
                <RefreshCw size={18} />
              </button>
            </div>

            <div className={styles.statusDetails}>
              <div className={styles.detailItem}>
                <Calendar size={20} />
                <div>
                  <span className={styles.detailLabel}>Data de Adesão</span>
                  <span className={styles.detailValue}>{formatDate(membership.dataAdesao)}</span>
                </div>
              </div>

              {membership.dataRenovacao && (
                <div className={styles.detailItem}>
                  <Calendar size={20} />
                  <div>
                    <span className={styles.detailLabel}>Próxima Renovação</span>
                    <span className={styles.detailValue}>{formatDate(membership.dataRenovacao)}</span>
                  </div>
                </div>
              )}

              <div className={styles.detailItem}>
                <CreditCard size={20} />
                <div>
                  <span className={styles.detailLabel}>Método de Pagamento</span>
                  <span className={styles.detailValue}>{membership.formaPagamento || 'Não definido'}</span>
                </div>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Valor Pago</span>
                <span className={styles.detailValue}>{membership.valorPago || 'Não definido'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Receipt */}
        {membership.comprovativoUrl && (
          <section className={styles.receiptSection}>
            <h2 className={styles.sectionTitle}>Recibo de Pagamento</h2>
            <div className={styles.receiptCard}>
              <div className={styles.receiptContent}>
                <p className={styles.receiptText}>
                  Comprovativo de pagamento disponível. Clique abaixo para descarregar o seu recibo.
                </p>
                <a href={membership.comprovativoUrl} target="_blank" rel="noopener noreferrer" className={styles.receiptBtn}>
                  <Download size={20} />
                  Descarregar Recibo
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Actions */}
        <section className={styles.actionsSection}>
          <h2 className={styles.sectionTitle}>Ações</h2>
          <div className={styles.actionsGrid}>
            <Link href="/clube-empreendedores" className={styles.actionCard}>
              <RefreshCw size={24} />
              <div>
                <h3>Renovar Adesão</h3>
                <p>Estender a sua subscrição para outro período</p>
              </div>
            </Link>

            <Link href="/contacto" className={styles.actionCard}>
              <AlertCircle size={24} />
              <div>
                <h3>Suporte</h3>
                <p>Contactar a equipa para dúvidas ou problemas</p>
              </div>
            </Link>

            <Link href="/dashboard" className={styles.actionCard}>
              <Check size={24} />
              <div>
                <h3>Voltar ao Dashboard</h3>
                <p>Aceder a outras funcionalidades</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Plan Upgrade */}
        <section className={styles.upgradeSection}>
          <h2 className={styles.sectionTitle}>Upgrade de Plano</h2>
          <p className={styles.sectionSubtitle}>
            Interessado em mudar para um plano superior? Contacte-nos para discutir as opções.
          </p>
          <Link href="/contacto" className={styles.upgradeBtn}>
            Solicitar Upgrade
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}