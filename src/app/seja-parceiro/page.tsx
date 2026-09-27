'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Check, Download, Crown, Star, Award, Building2, Users, Globe, TrendingUp, Mail, Phone, MapPin } from 'lucide-react';
import styles from './page.module.css';

type PackageType = 'bronze' | 'prata' | 'ouro';

const partnershipPackages = {
  bronze: {
    name: 'Bronze',
    icon: Award,
    color: '#cd7f32',
    price: 'Personalizado',
    benefits: [
      'Logo em site (secção parceiros)',
      'Menção em newsletter trimestral',
      'Acesso a eventos networking (2 bilhetes)',
      'Perfil na plataforma ABN',
      'Convites para webinars mensais',
      'Desconto de 10% em cursos ABN',
    ],
  },
  prata: {
    name: 'Prata',
    icon: Star,
    color: '#c0c0c0',
    price: 'Personalizado',
    benefits: [
      'Tudo do Bronze',
      'Banner em destaque no site',
      'Menção em newsletter mensal',
      'Acesso a eventos networking (5 bilhetes)',
      'Participação em painéis de discussão',
      'Matchmaking com startups/PMEs',
      'Desconto de 20% em cursos ABN',
      'Anúncio nas redes sociais (1x/semestre)',
    ],
  },
  ouro: {
    name: 'Ouro',
    icon: Crown,
    color: '#ffd700',
    price: 'Personalizado',
    benefits: [
      'Tudo da Prata',
      'Banner premium no site',
      'Destaque em newsletter quinzenal',
      'Acesso VIP a todos os eventos (10 bilhetes)',
      'Participação em conferências como speaker',
      'Co-organização de eventos anuais',
      'Desconto de 30% em cursos ABN',
      'Anúncio nas redes sociais (1x/mês)',
      'Relatório de impacto anual personalizado',
      'Mesa redonda com direcção ABN',
    ],
  },
};

const countries = [
  { value: 'mocambique', label: '🇲🇴 Moçambique' },
  { value: 'angola', label: '🇦🇴 Angola' },
  { value: 'guinebissau', label: '🇬🇼 Guiné-Bissau' },
  { value: 'saotome', label: '🇸🇹 São Tomé e Príncipe' },
  { value: 'caboverde', label: '🇨🇻 Cabo Verde' },
  { value: 'outro', label: ' Outro país' },
];

export default function SejaParceiroPage() {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('prata');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    organizacao: '',
    cargo: '',
    pacote: 'prata' as PackageType,
    pais: 'mocambique',
    mensagem: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePackageChange = (pkg: PackageType) => {
    setSelectedPackage(pkg);
    setFormData({ ...formData, pacote: pkg });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedMessage = `[CANDIDATURA PARCERIA ABN - PACOTE ${partnershipPackages[formData.pacote].name.toUpperCase()}]
Nome: ${formData.nome}
Email: ${formData.email}
Telefone: ${formData.telefone}
Organização: ${formData.organizacao}
Cargo: ${formData.cargo}
País: ${formData.pais}
Pacote de Interesse: ${partnershipPackages[formData.pacote].name}

Mensagem:
${formData.mensagem}`;

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nome,
          email: formData.email,
          message: formattedMessage
        })
      });

      await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'apply',
          organizationName: formData.organizacao,
          organizationType: 'institucional',
          partnerCategory: formData.pacote,
          focalPointName: formData.nome,
          focalPointEmail: formData.email,
          motivationMessage: formData.mensagem
        })
      });

      setSubmitted(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        organizacao: '',
        cargo: '',
        pacote: 'prata',
        pais: 'mocambique',
        mensagem: '',
      });
    } catch (err) {
      console.error('Erro ao submeter:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadDossier = () => {
    // Placeholder - quando o PDF real estiver disponível, substituir com o link real
    window.open('/docs/dossier-parceria-abn.pdf', '_blank');
  };

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.badge}>ABN PARTNERS</span>
            <h1 className={styles.heroTitle}>
              Seja Parceiro da<br />
              <span className={styles.heroTitleGold}>AfroBiz Network</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Construa o futuro dos negócios em África connosco. Torne-se parceiro e aceda a networking exclusivo, visibilidade estratégica e oportunidades de impacto.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.ctaBtn} onClick={() => setShowForm(true)}>
                Candidatar-se como Parceiro
              </button>
              <button className={styles.secondaryBtn} onClick={downloadDossier}>
                <Download size={20} />
                Descarregar Dossier
              </button>
            </div>
          </div>
        </section>

        {/* Benefits Overview */}
        <section className={styles.benefitsSection}>
          <h2 className={styles.sectionTitle}>Por que ser parceiro da ABN?</h2>
          <div className={styles.benefitsGrid}>
            {[
              { icon: Globe, title: 'Rede Pan-Africana', desc: 'Ligue-se a empreendedores e empresas em 5 países' },
              { icon: TrendingUp, title: 'Visibilidade Estratégica', desc: 'Destaque a sua marca no ecossistema ABN' },
              { icon: Users, title: 'Networking Exclusivo', desc: 'Acesso a eventos e conferências VIP' },
              { icon: Building2, title: 'Oportunidades B2B', desc: 'Matchmaking com startups e PMEs' },
            ].map((benefit, idx) => (
              <div key={idx} className={styles.benefitCard}>
                <benefit.icon size={32} className={styles.benefitIcon} />
                <h3>{benefit.title}</h3>
                <p>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partnership Packages */}
        <section className={styles.packagesSection}>
          <h2 className={styles.sectionTitle}>Pacotes de Parceria Anual</h2>
          <p className={styles.sectionSubtitle}>
            Escolha o pacote que melhor se adapta aos seus objetivos e orçamento
          </p>
          
          <div className={styles.packagesGrid}>
            {(Object.keys(partnershipPackages) as PackageType[]).map((pkg) => {
              const pkgData = partnershipPackages[pkg];
              const Icon = pkgData.icon;
              const isSelected = selectedPackage === pkg;

              return (
                <div
                  key={pkg}
                  className={`${styles.packageCard} ${isSelected ? styles.selected : ''}`}
                  onClick={() => handlePackageChange(pkg)}
                >
                  <div className={styles.packageHeader} style={{ borderColor: pkgData.color }}>
                    <div className={styles.packageIcon} style={{ backgroundColor: pkgData.color }}>
                      <Icon size={32} />
                    </div>
                    <div>
                      <h3 className={styles.packageName}>Pacote {pkgData.name}</h3>
                      <p className={styles.packagePrice}>{pkgData.price}</p>
                    </div>
                  </div>

                  <ul className={styles.packageBenefits}>
                    {pkgData.benefits.map((benefit, idx) => (
                      <li key={idx}>
                        <Check size={18} className={styles.checkIcon} />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <button className={styles.packageBtn}>
                    {isSelected ? 'Selecionado' : 'Selecionar'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Application Form */}
        {showForm && (
          <section className={styles.formSection}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h2>Candidatura a Parceiro</h2>
                <p>Preencha o formulário abaixo para expressar o seu interesse</p>
                <button className={styles.closeBtn} onClick={() => setShowForm(false)}></button>
              </div>

              {submitted ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}></div>
                  <h3>Candidatura Enviada!</h3>
                  <p>Obrigado pelo seu interesse em tornar-se parceiro da ABN. A nossa equipa entrará em contacto brevemente.</p>
                  <button className={styles.ctaBtn} onClick={() => setShowForm(false)}>
                    Fechar
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleFormSubmit}>
                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="nome">Nome Completo *</label>
                      <input
                        id="nome"
                        type="text"
                        required
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="O seu nome"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="email">Email *</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="telefone">Telefone</label>
                      <input
                        id="telefone"
                        type="tel"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        placeholder="+258 84 000 0000"
                      />
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="cargo">Cargo</label>
                      <input
                        id="cargo"
                        type="text"
                        value={formData.cargo}
                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                        placeholder="CEO, Diretor, etc."
                      />
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label htmlFor="organizacao">Organização / Empresa *</label>
                    <input
                      id="organizacao"
                      type="text"
                      required
                      value={formData.organizacao}
                      onChange={(e) => setFormData({ ...formData, organizacao: e.target.value })}
                      placeholder="Nome da sua organização"
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formField}>
                      <label htmlFor="pacote">Pacote de Interesse *</label>
                      <select
                        id="pacote"
                        required
                        value={formData.pacote}
                        onChange={(e) => setFormData({ ...formData, pacote: e.target.value as PackageType })}
                      >
                        <option value="bronze">Pacote Bronze</option>
                        <option value="prata">Pacote Prata</option>
                        <option value="ouro">Pacote Ouro</option>
                      </select>
                    </div>
                    <div className={styles.formField}>
                      <label htmlFor="pais">País *</label>
                      <select
                        id="pais"
                        required
                        value={formData.pais}
                        onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                      >
                        {countries.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label htmlFor="mensagem">Mensagem de Motivação</label>
                    <textarea
                      id="mensagem"
                      rows={4}
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      placeholder="Descreva brevemente como a sua organização pode contribuir para o ecossistema ABN..."
                    />
                  </div>

                  <div className={styles.formActions}>
                    <button type="button" className={styles.secondaryBtn} onClick={() => setShowForm(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className={styles.ctaBtn} disabled={loading}>
                      {loading ? 'A enviar...' : 'Enviar Candidatura'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className={styles.contactSection}>
          <h2 className={styles.sectionTitle}>Dúvidas?</h2>
          <p className={styles.sectionSubtitle}>
            Contacte a equipa de parcerias da ABN para mais informações
          </p>
          <div className={styles.contactGrid}>
            <a href="mailto:parcerias@abnafrobiznetwork.com" className={styles.contactCard}>
              <Mail size={24} />
              <div>
                <h3>Email</h3>
                <p>parcerias@abnafrobiznetwork.com</p>
              </div>
            </a>
            <a href="tel:+258845773974" className={styles.contactCard}>
              <Phone size={24} />
              <div>
                <h3>Telefone</h3>
                <p>+258 84 577 3974</p>
              </div>
            </a>
            <div className={styles.contactCard}>
              <MapPin size={24} />
              <div>
                <h3>Sede</h3>
                <p>Maputo, Moçambique</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}