'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Check, CreditCard, Smartphone, Building2, Users, Award, Calendar, TrendingUp, Globe } from 'lucide-react';
import styles from './page.module.css';

type BillingPeriod = 'mensal' | 'anual';
type PlanType = 'individual' | 'empresa';

const planBenefits = {
  individual: [
    'Acesso a eventos de networking mensais',
    'Participação em masterclasses exclusivas',
    'Mentoria de 1 hora/trim com especialistas',
    'Acesso à plataforma de oportunidades',
    'Desconto de 10% em cursos ABN',
    'Certificado de membro individual',
    'Acesso a canal de WhatsApp exclusivo',
  ],
  empresa: [
    'Tudo do plano Individual para 5 membros',
    'Matchmaking B2B com parceiros',
    'Banner na página de parceiros ABN',
    'Visibilidade em newsletters ABN',
    'Prioridade em oportunidades de negócio',
    'Mentoria de 4 horas/trim com especialistas',
    'Desconto de 20% em cursos ABN',
    'Certificado de membro corporativo',
    'Acesso a analytics de oportunidades',
  ],
};

const paymentMethods = {
  mocambique: [
    { name: 'M-Pesa', icon: '📱' },
    { name: 'e-Mola', icon: '💳' },
    { name: 'Transferência Bancária', icon: '🏦' },
    { name: 'Dinheiro (presencial)', icon: '💵' },
  ],
  angola: [
    { name: 'Kixico', icon: '📱' },
    { name: 'Transferência Bancária', icon: '🏦' },
    { name: 'Multicaixa Express', icon: '💳' },
  ],
  guinebissau: [
    { name: 'Transferência Bancária', icon: '🏦' },
    { name: 'Orange Money', icon: '📱' },
    { name: 'Dinheiro (presencial)', icon: '💵' },
  ],
  saotome: [
    { name: 'Transferência Bancária', icon: '🏦' },
    { name: 'Dinheiro (presencial)', icon: '💵' },
  ],
  caboverde: [
    { name: 'Transferência Bancária', icon: '🏦' },
    { name: 'Multicaixa', icon: '💳' },
    { name: 'Dinheiro (presencial)', icon: '💵' },
  ],
};

const prices = {
  individual: { mensal: 200, anual: 2000 },
  empresa: { mensal: 500, anual: 5000 },
};

const currencySymbols: Record<string, string> = {
  mocambique: 'MT',
  angola: 'AOA',
  guinebissau: 'XOF',
  saotome: 'STN',
  caboverde: 'CVE',
};

export default function ClubeEmpreendedoresPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<BillingPeriod>('mensal');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('individual');
  const [selectedCountry, setSelectedCountry] = useState('mocambique');

  const currency = currencySymbols[selectedCountry] || 'MT';
  const annualDiscount = 0.17; // 17% de desconto no anual

  const getPlanPrice = (plan: PlanType, period: BillingPeriod) => {
    const basePrice = prices[plan][period];
    return period === 'anual' 
      ? Math.round(basePrice * (1 - annualDiscount))
      : basePrice;
  };

  const getAnnualSavings = (plan: PlanType) => {
    const monthlyTotal = prices[plan].mensal * 12;
    const annualPrice = getPlanPrice(plan, 'anual');
    return monthlyTotal - annualPrice;
  };

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>Programa Exclusivo</span>
            <h1 className={styles.heroTitle}>
              Clube dos<br />
              <span className={styles.heroTitleGold}>Empreendedores</span>
            </h1>
            <p className={styles.heroSubtitle}>
              A comunidade oficial de networking, mentoria e oportunidades da ABN — AfroBiz Network.
              Conecte-se com empreendedores em 5 países e acelere o seu negócio.
            </p>
            
            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <Users size={24} />
                <span>+500 Membros</span>
              </div>
              <div className={styles.stat}>
                <Globe size={24} />
                <span>5 Países</span>
              </div>
              <div className={styles.stat}>
                <Calendar size={24} />
                <span>Eventos Mensais</span>
              </div>
            </div>
          </div>
        </section>

        {/* Billing Period Toggle */}
        <section className={styles.billingToggle}>
          <div className={styles.toggleContainer}>
            <button
              className={`${styles.toggleBtn} ${selectedPeriod === 'mensal' ? styles.active : ''}`}
              onClick={() => setSelectedPeriod('mensal')}
            >
              Mensal
            </button>
            <button
              className={`${styles.toggleBtn} ${selectedPeriod === 'anual' ? styles.active : ''}`}
              onClick={() => setSelectedPeriod('anual')}
            >
              Anual <span className={styles.discountBadge}>-17%</span>
            </button>
          </div>
        </section>

        {/* Country Selector */}
        <section className={styles.countrySelector}>
          <label className={styles.countryLabel}>Selecione o seu país para ver preços locais:</label>
          <div className={styles.countryGrid}>
            {Object.keys(paymentMethods).map(country => (
              <button
                key={country}
                className={`${styles.countryBtn} ${selectedCountry === country ? styles.active : ''}`}
                onClick={() => setSelectedCountry(country)}
              >
                {country === 'mocambique' && '🇲🇴 Moçambique'}
                {country === 'angola' && '🇦🇴 Angola'}
                {country === 'guinebissau' && '🇬🇼 Guiné-Bissau'}
                {country === 'saotome' && '🇸🇹 São Tomé e Príncipe'}
                {country === 'caboverde' && '🇨🇻 Cabo Verde'}
              </button>
            ))}
          </div>
        </section>

        {/* Plans */}
        <section className={styles.plansSection}>
          <h2 className={styles.sectionTitle}>Escolha o seu plano</h2>
          <div className={styles.plansGrid}>
            {/* Individual Plan */}
            <div
              className={`${styles.planCard} ${selectedPlan === 'individual' ? styles.selected : ''}`}
              onClick={() => setSelectedPlan('individual')}
            >
              <div className={styles.planHeader}>
                <div className={styles.planIcon}>
                  <Users size={32} />
                </div>
                <div>
                  <h3 className={styles.planName}>Individual</h3>
                  <p className={styles.planDesc}>Para empreendedores individuais</p>
                </div>
              </div>
              
              <div className={styles.planPrice}>
                <span className={styles.priceValue}>
                  {currency} {getPlanPrice('individual', selectedPeriod).toLocaleString()}
                </span>
                <span className={styles.pricePeriod}>/{selectedPeriod === 'mensal' ? 'mês' : 'ano'}</span>
              </div>

              {selectedPeriod === 'anual' && (
                <div className={styles.savings}>
                  Poupe {currency} {getAnnualSavings('individual').toLocaleString()}/ano
                </div>
              )}

              <ul className={styles.benefitsList}>
                {planBenefits.individual.map((benefit, idx) => (
                  <li key={idx}>
                    <Check size={18} className={styles.checkIcon} />
                    {benefit}
                  </li>
                ))}
              </ul>

              <button className={styles.planBtn}>
                {selectedPlan === 'individual' ? 'Selecionado' : 'Selecionar'}
              </button>
            </div>

            {/* Empresa Plan */}
            <div
              className={`${styles.planCard} ${styles.planCardEnterprise} ${selectedPlan === 'empresa' ? styles.selected : ''}`}
              onClick={() => setSelectedPlan('empresa')}
            >
              <div className={styles.planHeader}>
                <div className={styles.planIcon}>
                  <Building2 size={32} />
                </div>
                <div>
                  <h3 className={styles.planName}>Empresa / PME</h3>
                  <p className={styles.planDesc}>Para empresas e PMEs (até 5 membros)</p>
                </div>
              </div>
              
              <div className={styles.planPrice}>
                <span className={styles.priceValue}>
                  {currency} {getPlanPrice('empresa', selectedPeriod).toLocaleString()}
                </span>
                <span className={styles.pricePeriod}>/{selectedPeriod === 'mensal' ? 'mês' : 'ano'}</span>
              </div>

              {selectedPeriod === 'anual' && (
                <div className={styles.savings}>
                  Poupe {currency} {getAnnualSavings('empresa').toLocaleString()}/ano
                </div>
              )}

              <ul className={styles.benefitsList}>
                {planBenefits.empresa.map((benefit, idx) => (
                  <li key={idx}>
                    <Check size={18} className={styles.checkIcon} />
                    {benefit}
                  </li>
                ))}
              </ul>

              <button className={styles.planBtn}>
                {selectedPlan === 'empresa' ? 'Selecionado' : 'Selecionar'}
              </button>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className={styles.paymentSection}>
          <h2 className={styles.sectionTitle}>Meios de pagamento disponíveis</h2>
          <p className={styles.sectionSubtitle}>
            Aceitamos múltiplos métodos de pagamento seguros para a sua conveniência
          </p>
          
          <div className={styles.paymentGrid}>
            {paymentMethods[selectedCountry as keyof typeof paymentMethods].map((method, idx) => (
              <div key={idx} className={styles.paymentMethod}>
                <span className={styles.paymentIcon}>{method.icon}</span>
                <span className={styles.paymentName}>{method.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2>Pronto para fazer parte?</h2>
            <p>Junte-se à comunidade de empreendedores mais dinâmica de África.</p>
            <button className={styles.ctaBtn}>
              Aderir ao Clube - {currency} {getPlanPrice(selectedPlan, selectedPeriod).toLocaleString()}/{selectedPeriod === 'mensal' ? 'mês' : 'ano'}
            </button>
            <p className={styles.ctaNote}>
              Ao aderir, concorda com os <Link href="/termos">Termos de Uso</Link> e <Link href="/privacidade">Política de Privacidade</Link> da ABN.
            </p>
          </div>
        </section>

        {/* Already Member */}
        <section className={styles.memberSection}>
          <h2 className={styles.sectionTitle}>Já é membro?</h2>
          <p className={styles.memberText}>
            Aceda à sua área de membro para ver o estado da sua adesão, datas de renovação e descarregar recibos.
          </p>
          <Link href="/dashboard/clube" className={styles.memberBtn}>
            Aceder à Área de Membro
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}