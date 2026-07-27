'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Lock,
  Briefcase,
  Phone,
  Globe2,
  MapPin,
  Building2,
  Compass,
  Link2,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Flag,
  GraduationCap,
  Megaphone,
  Upload,
  FileCheck
} from 'lucide-react';
import styles from '../login/Auth.module.css';

const SECTORS = [
  'Agro-negócio', 'Tecnologia e Software', 'Fintech e Finanças', 'Saúde e Bem-estar',
  'Educação', 'Comércio e Retalho', 'Construção e Imobiliário', 'Energia e Ambiente',
  'Transportes e Logística', 'Turismo e Hotelaria', 'Média e Comunicação',
  'Moda e Têxtil', 'Alimentação e Bebidas', 'Consultoria e Serviços', 'Outro'
];

const COUNTRIES = [
  'Angola', 'Cabo Verde', 'Guiné-Bissau', 'Moçambique', 'Portugal',
  'São Tomé e Príncipe', 'Brasil', 'França', 'Espanha', 'Outro'
];

const NATIONALITIES = [
  'Angolana', 'Cabo-verdiana', 'Guineense', 'Moçambicana', 'Portuguesa',
  'São-tomense', 'Brasileira', 'Francesa', 'Espanhola', 'Sul-africana', 'Outra'
];

const EDUCATION_LEVELS = [
  'Ensino Secundário / Médio',
  'Técnico / Profissional',
  'Bacharelato / Licenciatura',
  'Pós-Graduação / Especialização',
  'Mestrado',
  'Doutoramento',
  'Outro'
];

const HEARD_ABOUT_SOURCES = [
  'Redes Sociais (Instagram, LinkedIn, Facebook...)',
  'Indicação / Recomendação (Amigo ou Colega)',
  'Evento / Conferência',
  'Pesquisa no Google / Web',
  'Notícias / Imprensa',
  'Outro'
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('empreendedor');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [company, setCompany] = useState('');
  const [sector, setSector] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [bio, setBio] = useState('');

  // Novos campos opcionais
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportBioPage, setPassportBioPage] = useState('');
  const [passportPhoto, setPassportPhoto] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [howHeardAboutUs, setHowHeardAboutUs] = useState('');
  const [uploadingBio, setUploadingBio] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Validate step before advancing
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
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleFileUpload = async (file: File, type: 'bio' | 'photo') => {
    const formData = new FormData();
    formData.append('file', file);

    if (type === 'bio') setUploadingBio(true);
    else setUploadingPhoto(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (type === 'bio') setPassportBioPage(data.url);
        else setPassportPhoto(data.url);
      } else {
        setError(data.error || 'Erro no upload do ficheiro.');
      }
    } catch {
      setError('Erro de ligação ao enviar ficheiro.');
    } finally {
      if (type === 'bio') setUploadingBio(false);
      else setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
          country,
          city,
          company,
          sector,
          linkedin,
          bio,
          birthDate,
          gender,
          nationality,
          passportBioPage,
          passportPhoto,
          educationLevel,
          howHeardAboutUs
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Erro ao registar conta.');
      }
    } catch (err) {
      setError('Erro de ligação ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.25rem' }}>
          <Link href="/" className={styles.backHome}>
            <ArrowLeft size={16} /> Voltar ao Site
          </Link>
        </div>

        <div className={styles.header}>
          <h1 className="text-gradient-gold">Junte-se à Rede</h1>
          <p>Comece a sua jornada empresarial hoje na ABN.</p>
        </div>

        {/* ── STEP PROGRESS BAR ── */}
        <div className={styles.stepBar}>
          <div className={styles.stepBarProgressTrack}>
            <div 
              className={styles.stepBarProgressFill} 
              style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
            />
          </div>

          <div 
            className={`${styles.stepItem} ${currentStep === 1 ? styles.stepItemActive : currentStep > 1 ? styles.stepItemDone : ''}`}
            onClick={() => currentStep > 1 && setCurrentStep(1)}
          >
            <div className={styles.stepBubble}>
              {currentStep > 1 ? <CheckCircle2 size={18} /> : 1}
            </div>
            <span className={styles.stepLabel}>Acesso</span>
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

          <div className={`${styles.stepItem} ${currentStep === 3 ? styles.stepItemActive : ''}`}>
            <div className={styles.stepBubble}>3</div>
            <span className={styles.stepLabel}>Detalhes</span>
          </div>
        </div>

        {error && (
          <div style={{ color: '#dc2626', marginBottom: '1.25rem', fontSize: '0.88rem', background: '#fef2f2', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #fecaca', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* ──────────────── PASSO 1: DADOS DE ACESSO ──────────────── */}
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.inputGroup}>
                <label>Nome Completo *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    placeholder="O seu nome completo"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                  <User className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Email *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <Mail className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Palavra-passe *</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
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
                Continuar para Perfil →
              </button>
            </div>
          )}

          {/* ──────────────── PASSO 2: TIPO DE CONTA & DADOS PESSOAIS ──────────────── */}
          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.inputGroup}>
                <label>Tipo de Conta *</label>
                <div className={styles.inputWrapper}>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    required
                  >
                    <option value="empreendedor">Empreendedor</option>
                    <option value="startup">Startup</option>
                    <option value="investidor">Investidor</option>
                    <option value="mentor">Mentor</option>
                  </select>
                  <Briefcase className={styles.inputIcon} size={18} />
                </div>
                
                <div className={styles.infoBox}>
                  {role === 'investidor' ? (
                    <>
                      💼 <strong>Investidor:</strong> Aceda a startups qualificadas, consulte pitch decks detalhados e envie propostas de financiamento na nossa plataforma.
                    </>
                  ) : role === 'mentor' ? (
                    <>
                      🤝 <strong>Mentor:</strong> Ofereça mentoria estratégica e smart money, acompanhe o crescimento de startups e contribua para o ecossistema ABN.
                    </>
                  ) : role === 'startup' ? (
                    <>
                      🏢 <strong>Startup:</strong> Registe o seu negócio, aceda a oportunidades de investimento, cursos certificados exclusivos e aumente o seu ABN Score.
                    </>
                  ) : (
                    <>
                      🚀 <strong>Empreendedor:</strong> Desenvolva as suas ideias, aceda a cursos certificados, candidate-se a programas de incubação e solicite mentorias no ABN Hub.
                    </>
                  )}
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label>
                    {role === 'investidor' ? 'Empresa / Fundo' : 'Empresa / Startup'}
                  </label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      placeholder={role === 'investidor' ? 'Ex: Fundo Growth' : 'Ex: AgriTech Solutions'}
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                    />
                    <Building2 className={styles.inputIcon} size={18} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Sector de Actividade</label>
                  <div className={styles.inputWrapper}>
                    <select
                      value={sector}
                      onChange={e => setSector(e.target.value)}
                    >
                      <option value="">Seleccionar sector</option>
                      {SECTORS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <Compass className={styles.inputIcon} size={18} />
                  </div>
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label>Data de Nascimento</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                    />
                    <Calendar className={styles.inputIcon} size={18} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Género</label>
                  <div className={styles.inputWrapper}>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                    >
                      <option value="">Seleccionar género</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                      <option value="Outro">Outro</option>
                      <option value="Prefiro não responder">Prefiro não responder</option>
                    </select>
                    <User className={styles.inputIcon} size={18} />
                  </div>
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label>Nacionalidade</label>
                  <div className={styles.inputWrapper}>
                    <select
                      value={nationality}
                      onChange={e => setNationality(e.target.value)}
                    >
                      <option value="">Seleccionar nacionalidade</option>
                      {NATIONALITIES.map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <Flag className={styles.inputIcon} size={18} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>País de Residência</label>
                  <div className={styles.inputWrapper}>
                    <select
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                    >
                      <option value="">Seleccionar país</option>
                      {COUNTRIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <Globe2 className={styles.inputIcon} size={18} />
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Cidade de Residência</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    placeholder="Ex: Bissau, Maputo, Luanda..."
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                  <MapPin className={styles.inputIcon} size={18} />
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
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ──────────────── PASSO 3: FORMAÇÃO, DOCUMENTOS & DETALHES ──────────────── */}
          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label>WhatsApp / Telefone</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="tel"
                      placeholder="+245 96 123 4567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                    <Phone className={styles.inputIcon} size={18} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>LinkedIn</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={linkedin}
                      onChange={e => setLinkedin(e.target.value)}
                    />
                    <Link2 className={styles.inputIcon} size={18} />
                  </div>
                </div>
              </div>

              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label>Nível Máximo de Escolaridade</label>
                  <div className={styles.inputWrapper}>
                    <select
                      value={educationLevel}
                      onChange={e => setEducationLevel(e.target.value)}
                    >
                      <option value="">Seleccionar escolaridade</option>
                      {EDUCATION_LEVELS.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                    <GraduationCap className={styles.inputIcon} size={18} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Como ficou a saber sobre a ABN?</label>
                  <div className={styles.inputWrapper}>
                    <select
                      value={howHeardAboutUs}
                      onChange={e => setHowHeardAboutUs(e.target.value)}
                    >
                      <option value="">Seleccionar opção</option>
                      {HEARD_ABOUT_SOURCES.map(src => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                    <Megaphone className={styles.inputIcon} size={18} />
                  </div>
                </div>
              </div>

              {/* Documentos do Passaporte */}
              <div className={styles.grid2}>
                <div className={styles.inputGroup}>
                  <label>Página de Dados do Passaporte</label>
                  <div className={styles.inputWrapper} style={{ position: 'relative' }}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'bio');
                      }}
                      id="passport-bio-file"
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="passport-bio-file"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        color: passportBioPage ? '#4ade80' : 'rgba(255,255,255,0.7)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {uploadingBio ? (
                        '⏳ A carregar...'
                      ) : passportBioPage ? (
                        <>
                          <FileCheck size={16} color="#4ade80" /> Carregado com Sucesso!
                        </>
                      ) : (
                        'Escolher ficheiro (PDF/Imagem)'
                      )}
                    </label>
                    <Upload className={styles.inputIcon} size={18} style={{ pointerEvents: 'none' }} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Fotografia do Passaporte</label>
                  <div className={styles.inputWrapper} style={{ position: 'relative' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'photo');
                      }}
                      id="passport-photo-file"
                      style={{ display: 'none' }}
                    />
                    <label
                      htmlFor="passport-photo-file"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '12px 14px 12px 42px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        color: passportPhoto ? '#4ade80' : 'rgba(255,255,255,0.7)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {uploadingPhoto ? (
                        '⏳ A carregar...'
                      ) : passportPhoto ? (
                        <>
                          <FileCheck size={16} color="#4ade80" /> Foto Carregada!
                        </>
                      ) : (
                        'Escolher Foto (Imagem)'
                      )}
                    </label>
                    <Upload className={styles.inputIcon} size={18} style={{ pointerEvents: 'none' }} />
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>
                  {role === 'investidor' ? 'O que procura investir / Ticket médio' : 'O que faz / O que procura'}
                </label>
                <div className={styles.inputWrapper}>
                  <textarea
                    placeholder={role === 'investidor'
                      ? 'Ex: Invisto em startups de Agro-Tech na África Lusófona...'
                      : 'Ex: Desenvolvemos soluções de tecnologia agrícola...'}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    style={{ paddingLeft: '44px' }}
                  />
                  <FileText className={styles.inputIcon} size={18} style={{ alignSelf: 'flex-start', marginTop: '12px' }} />
                </div>
              </div>

              <div className={styles.stepActions}>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={handlePrevStep}
                  disabled={loading}
                  style={{ padding: '12px 18px', fontSize: '0.88rem' }}
                >
                  ← Anterior
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ padding: '14px 20px', fontSize: '0.92rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  {loading ? 'A criar conta...' : 'Criar Conta Gratuita 🚀'}
                </button>
              </div>
            </div>
          )}

        </form>

        <p className={styles.footerText}>
          Já tem uma conta? <Link href="/login" className="text-gradient-gold">Faça login</Link>
        </p>
      </div>
    </div>
  );
}
