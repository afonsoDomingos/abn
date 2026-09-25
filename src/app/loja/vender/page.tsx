'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Store, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Globe2, 
  Zap, 
  Users, 
  CheckCircle2, 
  CreditCard, 
  ShoppingBag,
  HelpCircle,
  PackagePlus
} from 'lucide-react';
import ShopNavbar from '@/components/ShopNavbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import styles from './Vender.module.css';

export default function VenderNaABN() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {}
    }

    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleCtaClick = () => {
    if (currentUser) {
      // Se já está logado, leva direto ao painel de criação de produtos/serviços
      router.push('/dashboard/negocios');
    } else {
      // Se não está logado, leva ao registro com perfil de empreendedor
      router.push('/registro?perfil=empreendedor');
    }
  };

  return (
    <main className={styles.venderPage}>
      <ShopNavbar />

      {/* Hero Principal */}
      <section className={styles.hero} style={{ backgroundImage: `url('/bannerlojaabn.png')` }}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.tag}>
            <Store size={15} />
            <span>Venda com a ABN</span>
          </div>
          <h1 className={styles.heroTitle}>
            O seu negócio merece mais clientes e reconhecimento.
          </h1>
          <p className={styles.heroSubtitle}>
            Junte-se à maior rede de negócios de África. Abra a sua loja digital, publique produtos ou serviços e receba pedidos de milhares de empreendedores, empresas e membros da ABN.
          </p>

          <div className={styles.heroCtas}>
            <button onClick={handleCtaClick} className={styles.btnPrimary}>
              <PackagePlus size={18} />
              {currentUser ? 'Aceder ao Meu Painel de Vendas' : 'Abrir a Minha Loja Gratuitamente'}
            </button>
            <Link href="/loja" className={styles.btnSecondary}>
              <ShoppingBag size={18} />
              Explorar a Loja
            </Link>
          </div>

          {/* Métricas da Plataforma */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>+10.000</span>
              <span className={styles.statLabel}>Empreendedores Conectados</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>Controlo Total dos Seus Preços</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>54</span>
              <span className={styles.statLabel}>Países e Delegações em Expansão</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.container}>
        {/* Vantagens de Vender */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>PORQUÊ VENDER NA ABN</span>
            <h2 className={styles.sectionTitle}>Tudo o que precisa para acelerar as suas vendas</h2>
            <p className={styles.sectionDesc}>
              A AfroBiz Network não é apenas uma loja — é um ecossistema completo desenhado para fazer negócios crescerem.
            </p>
          </div>

          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Users size={24} />
              </div>
              <h3 className={styles.benefitTitle}>Público Qualificado</h3>
              <p className={styles.benefitText}>
                Os seus produtos e serviços são vistos diretamente por empresários, gestores e investidores que procuram soluções reais.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <Globe2 size={24} />
              </div>
              <h3 className={styles.benefitTitle}>Visibilidade Pan-Africana</h3>
              <p className={styles.benefitText}>
                Ultrapasse as fronteiras locais. Apresente o seu portfólio para hubs de negócios em Moçambique, Angola, Guiné-Bissau e diáspora.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <ShieldCheck size={24} />
              </div>
              <h3 className={styles.benefitTitle}>Credibilidade & Selo ABN</h3>
              <p className={styles.benefitText}>
                Ganhe a confiança do mercado por fazer parte de uma rede auditada com suporte institucional de ponta.
              </p>
            </div>
          </div>
        </section>

        {/* Como Funciona em 3 Passos */}
        <section className={styles.stepsSection}>
          <div className={styles.stepsHeader}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem', fontFamily: 'Outfit' }}>
              Como começar a vender em 3 passos simples
            </h2>
            <p style={{ opacity: 0.9, fontSize: '1rem' }}>
              Sem burocracias complicadas. A sua loja pode estar ativa ainda hoje.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            <div className={styles.stepBox}>
              <div className={styles.stepNum}>1</div>
              <h3 className={styles.stepTitle}>Crie a sua conta</h3>
              <p className={styles.stepDesc}>
                Registe os dados do seu negócio no portal ABN e selecione o perfil de Empreendedor ou Empresa.
              </p>
            </div>

            <div className={styles.stepBox}>
              <div className={styles.stepNum}>2</div>
              <h3 className={styles.stepTitle}>Publique os seus itens</h3>
              <p className={styles.stepDesc}>
                No seu painel, adicione fotos, descrição detalhada, preços e condições de entrega para cada produto ou serviço.
              </p>
            </div>

            <div className={styles.stepBox}>
              <div className={styles.stepNum}>3</div>
              <h3 className={styles.stepTitle}>Receba pedidos & lucre</h3>
              <p className={styles.stepDesc}>
                Os clientes compram diretamente através da loja, recebem suporte e você gere os pedidos no seu painel.
              </p>
            </div>
          </div>
        </section>

        {/* Perguntas Frequentes */}
        <section className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>DÚVIDAS FREQUENTES</span>
            <h2 className={styles.sectionTitle}>Perguntas comuns sobre vendas</h2>
          </div>

          <div className={styles.faqGrid}>
            <div className={styles.faqCard}>
              <h4 className={styles.faqQuestion}>Quem pode vender na ABN?</h4>
              <p className={styles.faqAnswer}>
                Qualquer empreendedor, profissional independente, startup ou PME com produtos ou serviços ativos pode submeter os seus itens.
              </p>
            </div>

            <div className={styles.faqCard}>
              <h4 className={styles.faqQuestion}>Que tipo de produtos posso cadastrar?</h4>
              <p className={styles.faqAnswer}>
                Pode vender produtos físicos (equipamentos, mercadorias, moda), produtos digitais (e-books, templates) e serviços profissionais de consultoria.
              </p>
            </div>

            <div className={styles.faqCard}>
              <h4 className={styles.faqQuestion}>Como recebo os pagamentos?</h4>
              <p className={styles.faqAnswer}>
                A plataforma suporta M-Pesa, e-Mola, transferências bancárias locais e canais internacionais conforme configurado na sua conta.
              </p>
            </div>

            <div className={styles.faqCard}>
              <h4 className={styles.faqQuestion}>Como controlo os meus pedidos?</h4>
              <p className={styles.faqAnswer}>
                Tem acesso a um painel de controlo dedicado onde vê os novos pedidos, dados de contacto dos compradores e histórico de vendas.
              </p>
            </div>
          </div>
        </section>

        {/* Banner CTA Final */}
        <div className={styles.finalCta}>
          <h3>Pronto para fazer o seu negócio crescer?</h3>
          <p>Não perca a oportunidade de posicionar a sua marca diante da maior comunidade de negócios.</p>
          <button onClick={handleCtaClick} className={styles.btnPrimary}>
            <Store size={20} />
            {currentUser ? 'Ir para o Painel de Negócios' : 'Começar a Vender Agora'}
          </button>
        </div>
      </div>

      <FloatingWhatsApp />
    </main>
  );
}
