'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Rocket,
  Lightbulb,
  Building2,
  DollarSign,
  GraduationCap,
  Target,
  Handshake,
  Users,
  Building
} from 'lucide-react';
import styles from '../login/Auth.module.css';

// ── 1. DEFINIÇÃO DOS PERFIS OFICIAIS ABN ──
interface ProfileCategory {
  id: string;
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
}

const PROFILE_CATEGORIES: ProfileCategory[] = [
  {
    id: 'empreendedor',
    title: 'Empreendedor',
    badge: 'Inovação',
    description: 'Fundador de projetos, novos negócios e ideias inovadoras no ecossistema.',
    icon: <Rocket size={28} />
  },
  {
    id: 'startup',
    title: 'Startup',
    badge: 'Escalabilidade',
    description: 'Negócio escalável em fase inicial, MVP, validação ou crescimento acelerado.',
    icon: <Lightbulb size={28} />
  },
  {
    id: 'empresa',
    title: 'Empresa / PME',
    badge: 'Corporativo',
    description: 'Empresa consolidada ou PME à procura de expansão, inovação e fornecedores.',
    icon: <Building2 size={28} />
  },
  {
    id: 'investidor',
    title: 'Investidor',
    badge: 'Capital',
    description: 'Business Angel, Fundo VC, investidor anjo ou corporativo em busca de deals.',
    icon: <DollarSign size={28} />
  },
  {
    id: 'mentor',
    title: 'Mentor',
    badge: 'Orientação',
    description: 'Especialista e líder de mercado que orienta fundadores e partilha know-how.',
    icon: <GraduationCap size={28} />
  },
  {
    id: 'consultor',
    title: 'Consultor / Especialista',
    badge: 'Expertise',
    description: 'Profissional qualificado em assessoria técnica, jurídica, financeira ou estratégica.',
    icon: <Target size={28} />
  },
  {
    id: 'parceiro',
    title: 'Parceiro',
    badge: 'Alianças',
    description: 'Parceiro estratégico corporativo, tecnológico, de média ou serviços de apoio.',
    icon: <Handshake size={28} />
  },
  {
    id: 'universidade',
    title: 'Universidade / Academia',
    badge: 'I&D & Ensino',
    description: 'Instituição de ensino superior, centros de investigação e polos científicos.',
    icon: <GraduationCap size={28} />
  },
  {
    id: 'incubadora',
    title: 'Incubadora / Aceleradora',
    badge: 'Ecossistema',
    description: 'Hub de apoio à incubação, capacitação e aceleração de novos negócios.',
    icon: <Building size={28} />
  },
  {
    id: 'organizacao',
    title: 'Organização / Instituição',
    badge: 'Institucional',
    description: 'ONGs, associações empresariais, câmaras de comércio ou entidades públicas.',
    icon: <Users size={28} />
  }
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // ── 1. DADOS DE ACESSO (PASSO 1) ──
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ── 2. ESCOLHA DE PERFIL (PASSO 2) ──
  const [selectedRole, setSelectedRole] = useState<string>('empreendedor');

  // Estados de Submissão
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validação por Etapa
  const handleNextStep = () => {
    setError('');

    if (currentStep === 1) {
      if (!name.trim()) {
        setError('Por favor, indique o seu nome completo.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Por favor, indique um endereço de email válido.');
        return;
      }
      if (password.length < 6) {
        setError('A palavra-passe deve ter pelo menos 6 caracteres.');
        return;
      }
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Submissão Final do Registo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: selectedRole,
          roles: [selectedRole]
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('abn_active_role', selectedRole);
        // Avançar para dashboard
        router.push('/dashboard');
      } else {
        setError(data.error || 'Erro ao registar conta.');
      }
    } catch {
      setError('Erro de ligação ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        
        {/* Voltar ao Site */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
          <Link href="/" className={styles.backHome}>
            <ArrowLeft size={16} /> Voltar ao Site
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className={styles.header}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(255,107,0,0.1)', color: '#ff6b00', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            <Sparkles size={14} /> Área Privada ABN
          </div>
          <h1 className="text-gradient-gold">Registo na Plataforma</h1>
          <p>
            {currentStep === 1 && 'Crie o seu acesso oficial à maior rede de negócios lusófona.'}
            {currentStep === 2 && 'Escolha a categoria que melhor define a sua atuação no ecossistema.'}
          </p>
        </div>

        {/* ── STEP PROGRESS BAR (1 A 2) ── */}
        <div className={styles.stepBar}>
          <div className={styles.stepBarProgressTrack}>
            <div 
              className={styles.stepBarProgressFill} 
              style={{ width: currentStep === 1 ? '0%' : '100%' }}
            />
          </div>

          <div 
            className={`${styles.stepItem} ${currentStep === 1 ? styles.stepItemActive : currentStep > 1 ? styles.stepItemDone : ''}`}
            onClick={() => currentStep > 1 && setCurrentStep(1)}
          >
            <div className={styles.stepBubble}>
              {currentStep > 1 ? <CheckCircle2 size={18} /> : 1}
            </div>
            <span className={styles.stepLabel}>Conta</span>
          </div>

          <div className={`${styles.stepItem} ${currentStep === 2 ? styles.stepItemActive : ''}`}>
            <div className={styles.stepBubble}>2</div>
            <span className={styles.stepLabel}>Perfil</span>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            fontSize: '0.86rem',
            fontWeight: 600
          }}>
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>

          {/* ──────────────────────────────────────────────────────────
             PASSO 1: CRIAR CONTA (ACESSO BÁSICO)
          ────────────────────────────────────────────────────────── */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.inputGroup}>
                <label>Nome Completo *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    placeholder="Ex: Culpa Francisco Xavier"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                  <User className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Endereço de E-mail *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <Mail className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Palavra-passe Segura *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    placeholder="Pelo menos 6 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <Lock className={styles.inputIcon} size={18} />
                </div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                  A palavra-passe deve conter pelo menos 6 caracteres.
                </span>
              </div>

              <button
                type="button"
                className="btn-primary"
                onClick={handleNextStep}
                style={{ marginTop: '0.75rem', padding: '12px', width: '100%', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', height: '48px' }}
              >
                Continuar para Escolher Perfil
              </button>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
             PASSO 2: ESCOLHER PERFIL (SELECÇÃO VISUAL)
          ────────────────────────────────────────────────────────── */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <label style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 700, 
                  color: '#0f172a',
                  marginBottom: '0.5rem',
                  display: 'block'
                }}>
                  Escolha o seu Perfil Principal *
                </label>
                <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
                  Selecione a categoria que melhor define a sua atuação no ecossistema ABN. Poderá adicionar mais perfis no Dashboard após o registo.
                </p>
              </div>

              <div className={styles.profileCardGrid}>
                {PROFILE_CATEGORIES.map(category => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedRole(category.id)}
                    className={`${styles.profileCard} ${selectedRole === category.id ? styles.profileCardSelected : ''}`}
                  >
                    <div className={styles.profileCardHeader}>
                      <div className={styles.profileCardIconBox}>
                        <div className={styles.profileCardIcon}>
                          {category.icon}
                        </div>
                      </div>
                      <div className={styles.profileCardCheck}>
                        {selectedRole === category.id && <CheckCircle2 size={12} />}
                      </div>
                    </div>
                    <h3 className={styles.profileCardTitle}>{category.title}</h3>
                    <span style={{ 
                      display: 'inline-block',
                      background: selectedRole === category.id ? '#ff6b00' : '#f1f5f9',
                      color: selectedRole === category.id ? '#ffffff' : '#64748b',
                      padding: '3px 8px',
                      borderRadius: '50px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {category.badge}
                    </span>
                    <p className={styles.profileCardDesc}>{category.description}</p>
                  </div>
                ))}
              </div>

              <div className={styles.stepActions}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={handlePrevStep}
                >
                  ← Anterior
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'A criar...' : 'Criar Conta'}
                </button>
              </div>
            </div>
          )}

        </form>

        <p className={styles.footerText}>
          Já tem uma conta na ABN? <Link href="/login" className="text-gradient-gold">Faça login aqui</Link>
        </p>
      </div>
    </div>
  );
}
