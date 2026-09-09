'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Phone,
  Globe2,
  MapPin,
  Building2,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Upload,
  Check,
  Sparkles,
  ShieldCheck,
  Share2,
  Award,
  Compass,
  Layers,
  Camera,
  ExternalLink
} from 'lucide-react';
import styles from '../login/Auth.module.css';

// ── 1. DEFINIÇÃO DOS PERFIS OFICIAIS ABN ──
interface ProfileCategory {
  id: string;
  title: string;
  icon: string;
  badge: string;
  description: string;
}

const PROFILE_CATEGORIES: ProfileCategory[] = [
  {
    id: 'empreendedor',
    title: 'Empreendedor',
    icon: '🚀',
    badge: 'Inovação',
    description: 'Fundador de projetos, novos negócios e ideias inovadoras no ecossistema.'
  },
  {
    id: 'startup',
    title: 'Startup',
    icon: '💡',
    badge: 'Escalabilidade',
    description: 'Negócio escalável em fase inicial, MVP, validação ou crescimento acelerado.'
  },
  {
    id: 'empresa',
    title: 'Empresa / PME',
    icon: '🏢',
    badge: 'Corporativo',
    description: 'Empresa consolidada ou PME à procura de expansão, inovação e fornecedores.'
  },
  {
    id: 'investidor',
    title: 'Investidor',
    icon: '💰',
    badge: 'Capital',
    description: 'Business Angel, Fundo VC, investidor anjo ou corporativo em busca de deals.'
  },
  {
    id: 'mentor',
    title: 'Mentor',
    icon: '🧭',
    badge: 'Orientação',
    description: 'Especialista e líder de mercado que orienta fundadores e partilha know-how.'
  },
  {
    id: 'consultor',
    title: 'Consultor / Especialista',
    icon: '🎯',
    badge: 'Expertise',
    description: 'Profissional qualificado em assessoria técnica, jurídica, financeira ou estratégica.'
  },
  {
    id: 'parceiro',
    title: 'Parceiro',
    icon: '🤝',
    badge: 'Alianças',
    description: 'Parceiro estratégico corporativo, tecnológico, de média ou serviços de apoio.'
  },
  {
    id: 'universidade',
    title: 'Universidade / Academia',
    icon: '🎓',
    badge: 'I&D & Ensino',
    description: 'Instituição de ensino superior, centros de investigação e polos científicos.'
  },
  {
    id: 'incubadora',
    title: 'Incubadora / Aceleradora',
    icon: '🏛️',
    badge: 'Ecossistema',
    description: 'Hub de apoio à incubação, capacitação e aceleração de novos negócios.'
  },
  {
    id: 'organizacao',
    title: 'Organização / Instituição',
    icon: '🌐',
    badge: 'Institucional',
    description: 'ONGs, associações empresariais, câmaras de comércio ou entidades públicas.'
  }
];

const SECTORS_LIST = [
  'Tecnologia e Software',
  'Fintech e Finanças',
  'Agro-negócio & Pescas',
  'Energia e Ambiente',
  'Saúde e Bem-estar',
  'Educação & EdTech',
  'Comércio e Retalho',
  'Construção e Imobiliário',
  'Transportes e Logística',
  'Turismo e Hotelaria',
  'Média e Comunicação',
  'Consultoria e Gestão'
];

const INTERESTS_LIST = [
  'Captação de Investimento',
  'Networking & Parcerias',
  'Mentoria Estratégica',
  'Incubação e Aceleração',
  'Cursos & Formação',
  'Transformação Digital',
  'Acesso a Novos Mercados',
  'Inovação Aberta',
  'Contratação de Talentos',
  'Comércio Internacional'
];

const LANGUAGES_LIST = [
  'Português',
  'Inglês',
  'Francês',
  'Espanhol',
  'Mandarim',
  'Árabe'
];

const SKILLS_SUGGESTIONS = [
  'Gestão Estratégica',
  'Desenvolvimento de Produto',
  'Finanças & Valuation',
  'Marketing Digital',
  'Liderança & Vendas',
  'Inteligência Artificial',
  'Pitch Deck & Fundraising',
  'Direito Empresarial',
  'Operações & Logística',
  'Data Analytics'
];

const COUNTRIES = [
  'Angola', 'Cabo Verde', 'Guiné-Bissau', 'Moçambique', 'Portugal',
  'São Tomé e Príncipe', 'Brasil', 'França', 'Espanha', 'Outro'
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // ── 1. DADOS DE ACESSO (PASSO 1) ──
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ── 2. ESCOLHA DE PERFIL / MULTI-CATEGORIAS (PASSO 2) ──
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['empreendedor']);
  const [primaryRole, setPrimaryRole] = useState<string>('empreendedor');

  // ── 3. PERFIL PROFISSIONAL & DADOS BÁSICOS (PASSO 3) ──
  const [profileImage, setProfileImage] = useState('');
  const [country, setCountry] = useState('Angola');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  
  // Redes Sociais
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');

  // Áreas de Interesse & Setores (multi)
  const [selectedSectors, setSelectedSectors] = useState<string[]>(['Tecnologia e Software']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Captação de Investimento', 'Networking & Parcerias']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['Português']);
  
  // Experiência & Competências
  const [experience, setExperience] = useState('3 a 5 anos de experiência');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Gestão Estratégica', 'Liderança & Vendas']);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Estados de Upload & Submissão
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Alternar categoria de perfil
  const toggleRole = (roleId: string) => {
    setError('');
    let nextRoles: string[];
    if (selectedRoles.includes(roleId)) {
      if (selectedRoles.length === 1) {
        setError('Deve manter pelo menos uma categoria de perfil selecionada.');
        return;
      }
      nextRoles = selectedRoles.filter(r => r !== roleId);
    } else {
      nextRoles = [...selectedRoles, roleId];
    }
    setSelectedRoles(nextRoles);
    if (!nextRoles.includes(primaryRole)) {
      setPrimaryRole(nextRoles[0]);
    }
  };

  // Alternar seleções de chips
  const toggleSector = (sec: string) => {
    setSelectedSectors(prev =>
      prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills(prev => [...prev, trimmed]);
      setCustomSkillInput('');
    }
  };

  // Upload de Foto de Perfil
  const handlePhotoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadingPhoto(true);
    setError('');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setProfileImage(data.url);
      } else {
        setError(data.error || 'Erro no upload da fotografia.');
      }
    } catch {
      setError('Erro de ligação ao carregar a imagem.');
    } finally {
      setUploadingPhoto(false);
    }
  };

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
    } else if (currentStep === 2) {
      if (selectedRoles.length === 0) {
        setError('Por favor, selecione pelo menos uma categoria de perfil.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!phone.trim()) {
        setError('Por favor, indique um número de telefone ou WhatsApp de contacto.');
        return;
      }
      setCurrentStep(4);
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
          role: primaryRole,
          roles: selectedRoles,
          profileImage,
          phone,
          country,
          city,
          company,
          sector: selectedSectors[0] || '',
          sectors: selectedSectors,
          website,
          linkedin,
          socialLinks: {
            linkedin,
            twitter,
            instagram
          },
          bio,
          interests: selectedInterests,
          languages: selectedLanguages,
          experience,
          skills: selectedSkills
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
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
      <div className={`${styles.authCard} ${currentStep >= 2 ? styles.authCardWide : ''}`}>
        
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
            {currentStep === 2 && 'Escolha uma ou mais categorias que definem a sua atuação no ecossistema.'}
            {currentStep === 3 && 'Complete o seu perfil profissional com contactos, setores e competências.'}
            {currentStep === 4 && 'Reveja e valide os dados da sua conta antes de aceder ao ABN Dashboard.'}
          </p>
        </div>

        {/* ── STEP PROGRESS BAR (1 A 4) ── */}
        <div className={styles.stepBar}>
          <div className={styles.stepBarProgressTrack}>
            <div 
              className={styles.stepBarProgressFill} 
              style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '33.3%' : currentStep === 3 ? '66.6%' : '100%' }}
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

          <div 
            className={`${styles.stepItem} ${currentStep === 2 ? styles.stepItemActive : currentStep > 2 ? styles.stepItemDone : ''}`}
            onClick={() => currentStep > 2 && setCurrentStep(2)}
          >
            <div className={styles.stepBubble}>
              {currentStep > 2 ? <CheckCircle2 size={18} /> : 2}
            </div>
            <span className={styles.stepLabel}>Perfil</span>
          </div>

          <div 
            className={`${styles.stepItem} ${currentStep === 3 ? styles.stepItemActive : currentStep > 3 ? styles.stepItemDone : ''}`}
            onClick={() => currentStep > 3 && setCurrentStep(3)}
          >
            <div className={styles.stepBubble}>
              {currentStep > 3 ? <CheckCircle2 size={18} /> : 3}
            </div>
            <span className={styles.stepLabel}>Profissional</span>
          </div>

          <div className={`${styles.stepItem} ${currentStep === 4 ? styles.stepItemActive : ''}`}>
            <div className={styles.stepBubble}>4</div>
            <span className={styles.stepLabel}>Verificação</span>
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
            ⚠️ {error}
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
                style={{ marginTop: '0.75rem', padding: '14px 20px', width: '100%', fontSize: '0.92rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                Continuar para Escolher Perfil →
              </button>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
             PASSO 2: ESCOLHER PERFIL / CATEGORIAS (MULTI-SELEÇÃO)
          ────────────────────────────────────────────────────────── */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className={styles.selectedRolesBanner}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c2410c', textTransform: 'uppercase' }}>
                    Categorias Selecionadas ({selectedRoles.length})
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Pode selecionar mais de uma
                  </span>
                </div>
                <div className={styles.selectedRolesList}>
                  {selectedRoles.map(roleId => {
                    const found = PROFILE_CATEGORIES.find(c => c.id === roleId);
                    const isPrimary = roleId === primaryRole;
                    return (
                      <span 
                        key={roleId} 
                        className={`${styles.roleTag} ${isPrimary ? styles.roleTagPrimary : ''}`}
                        title={isPrimary ? 'Perfil Principal da Conta' : 'Clique para definir como principal'}
                        onClick={() => setPrimaryRole(roleId)}
                        style={{ cursor: 'pointer' }}
                      >
                        {found?.icon} {found?.title} {isPrimary && '★ Principal'}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className={styles.profileCardGrid}>
                {PROFILE_CATEGORIES.map(category => {
                  const isSelected = selectedRoles.includes(category.id);
                  return (
                    <div
                      key={category.id}
                      className={`${styles.profileCard} ${isSelected ? styles.profileCardSelected : ''}`}
                      onClick={() => toggleRole(category.id)}
                    >
                      <div className={styles.profileCardHeader}>
                        <span className={styles.profileCardIcon}>{category.icon}</span>
                        <div className={styles.profileCardCheck}>
                          {isSelected && <Check size={14} />}
                        </div>
                      </div>
                      <div className={styles.profileCardTitle}>{category.title}</div>
                      <div className={styles.profileCardDesc}>{category.description}</div>
                    </div>
                  );
                })}
              </div>

              {selectedRoles.length > 1 && (
                <div className={styles.inputGroup} style={{ marginTop: '0.5rem' }}>
                  <label>Perfil Principal de Visualização Inicial *</label>
                  <div className={styles.inputWrapper}>
                    <select
                      value={primaryRole}
                      onChange={e => setPrimaryRole(e.target.value)}
                    >
                      {selectedRoles.map(roleId => {
                        const cat = PROFILE_CATEGORIES.find(c => c.id === roleId);
                        return (
                          <option key={roleId} value={roleId}>
                            {cat?.title || roleId}
                          </option>
                        );
                      })}
                    </select>
                    <Layers className={styles.inputIcon} size={18} />
                  </div>
                </div>
              )}

              <div className={styles.stepActions}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={handlePrevStep}
                  style={{ padding: '12px 18px', fontSize: '0.88rem' }}
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNextStep}
                  style={{ padding: '12px 20px', fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  Continuar para Perfil Profissional →
                </button>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
             PASSO 3: CRIAR PERFIL PROFISSIONAL
          ────────────────────────────────────────────────────────── */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Fotografia de Perfil */}
              <div className={styles.avatarSection}>
                {profileImage ? (
                  <img src={profileImage} alt="Avatar" className={styles.avatarPreview} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    <User size={32} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '4px' }}>
                    Fotografia de Perfil
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 8px 0' }}>
                    Uma foto profissional gera 80% mais confiança e conexões na rede.
                  </p>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="profile-avatar-upload"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                      }}
                    />
                    <label
                      htmlFor="profile-avatar-upload"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        background: '#0f172a',
                        color: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <Camera size={14} /> {uploadingPhoto ? 'A carregar foto...' : profileImage ? 'Alterar Foto' : 'Carregar Fotografia'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Localização & Contactos */}
              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label>País de Residência / Sede *</label>
                  <div className={styles.inputWrapper}>
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                    >
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <Globe2 className={styles.inputIcon} size={18} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Cidade *</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      placeholder="Ex: Luanda, Maputo, Lisboa, Bissau..."
                      value={city}
                      onChange={e => setCity(e.target.value)}
                    />
                    <MapPin className={styles.inputIcon} size={18} />
                  </div>
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label>Telefone / WhatsApp *</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="tel"
                      placeholder="+244 923 000 000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      required
                    />
                    <Phone className={styles.inputIcon} size={18} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Website ou Portfólio</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="url"
                      placeholder="https://suaempresa.com"
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                    />
                    <ExternalLink className={styles.inputIcon} size={18} />
                  </div>
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label>Nome da Empresa / Organização (Opcional)</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      placeholder="Ex: Global Tech Ventures"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                    />
                    <Building2 className={styles.inputIcon} size={18} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Experiência Profissional</label>
                  <div className={styles.inputWrapper}>
                    <select
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                    >
                      <option value="Menos de 1 ano">Iniciante / Menos de 1 ano</option>
                      <option value="1 a 3 anos">1 a 3 anos de experiência</option>
                      <option value="3 a 5 anos de experiência">3 a 5 anos de experiência</option>
                      <option value="5 a 10 anos">5 a 10 anos (Sénior / Líder)</option>
                      <option value="Mais de 10 anos">Mais de 10 anos (Especialista / C-Level)</option>
                    </select>
                    <Award className={styles.inputIcon} size={18} />
                  </div>
                </div>
              </div>

              {/* Redes Sociais */}
              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label>LinkedIn (URL do Perfil)</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={linkedin}
                      onChange={e => setLinkedin(e.target.value)}
                    />
                    <Share2 className={styles.inputIcon} size={18} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Twitter / X ou Instagram</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      placeholder="@seu_utilizador"
                      value={twitter || instagram}
                      onChange={e => {
                        setTwitter(e.target.value);
                        setInstagram(e.target.value);
                      }}
                    />
                    <Share2 className={styles.inputIcon} size={18} />
                  </div>
                </div>
              </div>

              {/* Biografia */}
              <div className={styles.inputGroup}>
                <label>Biografia Profissional & Objetivos</label>
                <div className={styles.inputWrapper}>
                  <textarea
                    rows={3}
                    placeholder="Conte resumidamente a sua trajetória, projetos e o que procura ou oferece na ABN..."
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    style={{ paddingLeft: '44px' }}
                  />
                  <FileText className={styles.inputIcon} size={18} style={{ alignSelf: 'flex-start', marginTop: '12px' }} />
                </div>
              </div>

              {/* Setores de Atividade */}
              <div className={styles.inputGroup}>
                <label>Setores de Atuação (Selecione os que se aplicam)</label>
                <div className={styles.chipContainer}>
                  {SECTORS_LIST.map(sec => {
                    const active = selectedSectors.includes(sec);
                    return (
                      <span
                        key={sec}
                        className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                        onClick={() => toggleSector(sec)}
                      >
                        {sec}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Áreas de Interesse */}
              <div className={styles.inputGroup}>
                <label>Áreas de Interesse na Plataforma</label>
                <div className={styles.chipContainer}>
                  {INTERESTS_LIST.map(item => {
                    const active = selectedInterests.includes(item);
                    return (
                      <span
                        key={item}
                        className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                        onClick={() => toggleInterest(item)}
                      >
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Idiomas */}
              <div className={styles.inputGroup}>
                <label>Idiomas Falados</label>
                <div className={styles.chipContainer}>
                  {LANGUAGES_LIST.map(lang => {
                    const active = selectedLanguages.includes(lang);
                    return (
                      <span
                        key={lang}
                        className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                        onClick={() => toggleLanguage(lang)}
                      >
                        {lang}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Competências */}
              <div className={styles.inputGroup}>
                <label>Competências & Habilidades Chave</label>
                <div className={styles.chipContainer}>
                  {SKILLS_SUGGESTIONS.map(sk => {
                    const active = selectedSkills.includes(sk);
                    return (
                      <span
                        key={sk}
                        className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                        onClick={() => toggleSkill(sk)}
                      >
                        {sk}
                      </span>
                    );
                  })}
                </div>
                {/* Adicionar competência manual */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input
                    type="text"
                    placeholder="Adicionar outra competência (ex: Negociação Internacional)..."
                    value={customSkillInput}
                    onChange={e => setCustomSkillInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#0f172a',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    + Adicionar
                  </button>
                </div>
              </div>

              <div className={styles.stepActions}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={handlePrevStep}
                  style={{ padding: '12px 18px', fontSize: '0.88rem' }}
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNextStep}
                  style={{ padding: '12px 20px', fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  Continuar para Verificação →
                </button>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
             PASSO 4: VERIFICAÇÃO E CONFIRMAÇÃO
          ────────────────────────────────────────────────────────── */}
          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className={styles.verificationCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                  {profileImage ? (
                    <img src={profileImage} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ff6b00' }} />
                  ) : (
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#475569' }}>
                      {name ? name.substring(0, 2).toUpperCase() : 'AB'}
                    </div>
                  )}
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#0f172a', fontFamily: 'Outfit' }}>
                      {name || 'Nome do Utilizador'}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                      {email} • {city ? `${city}, ` : ''}{country}
                    </p>
                  </div>
                </div>

                <div className={styles.verificationSummaryRow}>
                  <span>Categorias Escolhidas</span>
                  <span style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {selectedRoles.map(r => {
                      const cat = PROFILE_CATEGORIES.find(c => c.id === r);
                      return (
                        <span key={r} style={{ background: '#f1f5f9', color: '#0f172a', padding: '2px 8px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                          {cat?.icon} {cat?.title}
                        </span>
                      );
                    })}
                  </span>
                </div>

                <div className={styles.verificationSummaryRow}>
                  <span>Perfil Principal</span>
                  <span style={{ color: '#ff6b00', fontWeight: 800 }}>
                    {PROFILE_CATEGORIES.find(c => c.id === primaryRole)?.title || primaryRole}
                  </span>
                </div>

                <div className={styles.verificationSummaryRow}>
                  <span>Contacto Telefónico</span>
                  <span>{phone || 'Não informado'}</span>
                </div>

                {website && (
                  <div className={styles.verificationSummaryRow}>
                    <span>Website</span>
                    <span>{website}</span>
                  </div>
                )}

                <div className={styles.verificationSummaryRow}>
                  <span>Setores de Atuação</span>
                  <span style={{ maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedSectors.join(', ') || 'Geral'}
                  </span>
                </div>

                <div className={styles.verificationSummaryRow}>
                  <span>Áreas de Interesse</span>
                  <span style={{ maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedInterests.join(', ') || 'Geral'}
                  </span>
                </div>

                <div className={styles.verificationSummaryRow}>
                  <span>Estado de Verificação</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: 800 }}>
                    <ShieldCheck size={16} /> Pronta para Ativação Imediata
                  </span>
                </div>
              </div>

              <div style={{ background: 'rgba(255,107,0,0.06)', border: '1px solid rgba(255,107,0,0.2)', padding: '1rem', borderRadius: '12px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                ℹ️ Ao clicar em <strong>"Ativar Conta e Entrar no Dashboard"</strong>, a sua conta multi-perfil será criada instantaneamente e terá acesso imediato às ferramentas personalizadas do ecossistema ABN.
              </div>

              <div className={styles.stepActions}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={handlePrevStep}
                  disabled={loading}
                  style={{ padding: '12px 18px', fontSize: '0.88rem' }}
                >
                  ← Editar Dados
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ padding: '14px 20px', fontSize: '0.92rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  {loading ? 'A criar a sua conta...' : 'Ativar Conta e Entrar no Dashboard 🚀'}
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
