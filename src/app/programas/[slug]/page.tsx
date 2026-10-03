import { Metadata } from 'next';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';
import styles from './page.module.css';

interface Program {
  _id: string;
  title: string;
  description: string;
  duration: string;
  beneficios: string;
  requisitos: string;
  publicoAlvo: string;
  investimento: string;
  processoSelecao: string;
  criteriosSelecao: string;
  phase: string;
  status: string;
  image?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const baseUrl = 'https://www.abnafrobiznetwork.com';
    const res = await fetch(`${baseUrl}/api/programs`, {
      cache: 'no-store'
    });
    const data = await res.json();

    if (data.success && data.programs) {
      const program = data.programs.find((p: Program) => {
        const titleSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return titleSlug === slug || p._id === slug;
      });

      if (program) {
        const shortDescription = program.description.split('\n')[0] || program.description;
        const imageUrl = program.image || 'https://www.abnafrobiznetwork.com/abn-logo.png';

        return {
          title: `${program.title} - ABN AfroBiz Network`,
          description: shortDescription,
          openGraph: {
            title: program.title,
            description: shortDescription,
            url: `${baseUrl}/programas/${slug}`,
            siteName: 'ABN - AfroBiz Network',
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
              },
            ],
            locale: 'pt_PT',
            type: 'article',
          },
          twitter: {
            card: 'summary_large_image',
            title: program.title,
            description: shortDescription,
            images: [imageUrl],
          },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching program for metadata:', error);
  }

  return {
    title: 'Programa - ABN AfroBiz Network',
    description: 'Programas de incubação, aceleração e capacitação para empreendedores africanos.',
  };
}

function getProgramColor(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('startup') || t.includes('incubação')) return '#ff6b00';
  if (t.includes('clube')) return '#3b82f6';
  if (t.includes('mentalidade')) return '#8b5cf6';
  if (t.includes('voz')) return '#10b981';
  if (t.includes('rota')) return '#f59e0b';
  return '#ff6b00';
}

function formatText(text: string): string[] {
  if (!text) return [];
  return text.split('\n').filter(line => line.trim());
}

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const baseUrl = window.location.origin;
        const res = await fetch(`${baseUrl}/api/programs`);
        if (!res.ok) {
          console.error('API response not OK:', res.status, res.statusText);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.success && data.programs) {
          const foundProgram = data.programs.find((p: Program) => {
            const titleSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return titleSlug === slug || p._id === slug;
          });
          setProgram(foundProgram || null);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching program:', err);
        setLoading(false);
      }
    };

    fetchProgram();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Carregando programa...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!program) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.error}>
            <h1>Programa não encontrado</h1>
            <p>O programa que procura não existe ou foi movido.</p>
            <a href="/programas" className={styles.btn}>Voltar para Programas</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const color = getProgramColor(program.title);
  const beneficiosList = formatText(program.beneficios);
  const requisitosList = formatText(program.requisitos);
  const publicoAlvoList = formatText(program.publicoAlvo);

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.container}>
        {/* Hero Section */}
        <div className={styles.hero} style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}>
          <div className={styles.heroContent}>
            <div className={styles.heroIcon} style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              <ArrowRight size={48} />
            </div>
            <h1>{program.title}</h1>
            <p>{program.description}</p>
            <div className={styles.heroMeta}>
              <span className={styles.durationBadge}>
                <ArrowRight size={16} style={{ marginRight: '8px' }} />
                {program.duration}
              </span>
              <span className={styles.phaseBadge}>{program.phase}</span>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {/* Público Alvo */}
          {publicoAlvoList.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Público Alvo</h2>
              <div className={styles.benefitsGrid}>
                {publicoAlvoList.map((item, i) => (
                  <div key={i} className={styles.benefitItem}>
                    <div className={styles.benefitIcon} style={{ color: color }}>→</div>
                    <span>{item.replace(/^[•\-\*]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefícios */}
          {beneficiosList.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Benefícios</h2>
              <div className={styles.benefitsGrid}>
                {beneficiosList.map((benefit, i) => (
                  <div key={i} className={styles.benefitItem}>
                    <div className={styles.benefitIcon} style={{ color: color }}>✓</div>
                    <span>{benefit.replace(/^[•\-\*]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requisitos */}
          {requisitosList.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Requisitos</h2>
              <div className={styles.requirementsList}>
                {requisitosList.map((req, i) => (
                  <div key={i} className={styles.requirementItem}>
                    <span className={styles.requirementNumber}>{i + 1}</span>
                    <span>{req.replace(/^[•\-\*]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investimento */}
          {program.investimento && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Investimento</h2>
              <p className={styles.descriptionText}>{program.investimento}</p>
            </div>
          )}

          {/* Processo de Seleção */}
          {program.processoSelecao && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Processo de Seleção</h2>
              <p className={styles.descriptionText}>{program.processoSelecao}</p>
            </div>
          )}

          {/* CTA Section */}
          <div className={styles.cta}>
            <button
              onClick={() => router.push(`/programas/${slug}/inscrever`)}
              className={styles.btn}
              style={{ background: color }}
            >
              Inscrever-se Agora
            </button>
            <a href="/contacto" className={styles.btnSecondary}>
              Entrar em Contacto
            </a>
            <a href="/programas" className={styles.btnSecondary}>
              Voltar para Programas
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const baseUrl = window.location.origin;
        const res = await fetch(`${baseUrl}/api/programs`);
        if (!res.ok) {
          console.error('API response not OK:', res.status, res.statusText);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.success && data.programs) {
          const foundProgram = data.programs.find((p: Program) => {
            const titleSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            return titleSlug === slug || p._id === slug;
          });
          setProgram(foundProgram || null);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching program:', err);
        setLoading(false);
      }
    };

    fetchProgram();
  }, [slug]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Carregando programa...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!program) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.container}>
          <div className={styles.error}>
            <h1>Programa não encontrado</h1>
            <p>O programa que procura não existe ou foi movido.</p>
            <a href="/programas" className={styles.btn}>Voltar para Programas</a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const color = getProgramColor(program.title);
  const beneficiosList = formatText(program.beneficios);
  const requisitosList = formatText(program.requisitos);
  const publicoAlvoList = formatText(program.publicoAlvo);

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.container}>
        {/* Hero Section */}
        <div className={styles.hero} style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}>
          <div className={styles.heroContent}>
            <div className={styles.heroIcon} style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              <ArrowRight size={48} />
            </div>
            <h1>{program.title}</h1>
            <p>{program.description}</p>
            <div className={styles.heroMeta}>
              <span className={styles.durationBadge}>
                <ArrowRight size={16} style={{ marginRight: '8px' }} />
                {program.duration}
              </span>
              <span className={styles.phaseBadge}>{program.phase}</span>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {/* Público Alvo */}
          {publicoAlvoList.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Público Alvo</h2>
              <div className={styles.benefitsGrid}>
                {publicoAlvoList.map((item, i) => (
                  <div key={i} className={styles.benefitItem}>
                    <div className={styles.benefitIcon} style={{ color: color }}>→</div>
                    <span>{item.replace(/^[•\-\*]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefícios */}
          {beneficiosList.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Benefícios</h2>
              <div className={styles.benefitsGrid}>
                {beneficiosList.map((benefit, i) => (
                  <div key={i} className={styles.benefitItem}>
                    <div className={styles.benefitIcon} style={{ color: color }}>✓</div>
                    <span>{benefit.replace(/^[•\-\*]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requisitos */}
          {requisitosList.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Requisitos</h2>
              <div className={styles.requirementsList}>
                {requisitosList.map((req, i) => (
                  <div key={i} className={styles.requirementItem}>
                    <span className={styles.requirementNumber}>{i + 1}</span>
                    <span>{req.replace(/^[•\-\*]\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investimento */}
          {program.investimento && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Investimento</h2>
              <p className={styles.descriptionText}>{program.investimento}</p>
            </div>
          )}

          {/* Processo de Seleção */}
          {program.processoSelecao && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Processo de Seleção</h2>
              <p className={styles.descriptionText}>{program.processoSelecao}</p>
            </div>
          )}

          {/* CTA Section */}
          <div className={styles.cta}>
            <button
              onClick={() => router.push(`/programas/${slug}/inscrever`)}
              className={styles.btn}
              style={{ background: color }}
            >
              Inscrever-se Agora
            </button>
            <a href="/contacto" className={styles.btnSecondary}>
              Entrar em Contacto
            </a>
            <a href="/programas" className={styles.btnSecondary}>
              Voltar para Programas
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}