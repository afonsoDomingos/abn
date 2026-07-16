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
  ArrowLeft
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

export default function RegisterPage() {
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
          bio
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Erro ao registar');
      }
    } catch (err) {
      setError('Erro de ligação ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard} style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
          <Link href="/" className={styles.backHome}>
            <ArrowLeft size={16} /> Voltar ao Site
          </Link>
        </div>
        
        <div className={styles.header}>
          <h1 className="text-gradient-gold">Junte-se à Rede</h1>
          <p>Comece a sua jornada empresarial hoje na ABN.</p>
        </div>

        {error && (
          <div style={{ color: '#ff4d4d', marginBottom: '1.5rem', fontSize: '0.9rem', background: 'rgba(255,77,77,0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,77,77,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          
          {/* 1. DADOS DE ACESSO */}
          <div className={styles.stepDivider}>
            <h3 className={styles.sectionTitle}>
              <span>1.</span> Dados de Acesso
            </h3>
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
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                  A palavra-passe deve conter pelo menos 6 caracteres.
                </span>
              </div>
            </div>
          </div>

          {/* 2. TIPO DE PERFIL */}
          <div className={styles.stepDivider}>
            <h3 className={styles.sectionTitle}>
              <span>2.</span> Tipo de Perfil
            </h3>
            <div className={styles.inputGroup}>
              <label>Tipo de Conta *</label>
              <div className={styles.inputWrapper}>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  required
                >
                  <option value="empreendedor">Empreendedor / Startup</option>
                  <option value="investidor">Investidor</option>
                </select>
                <Briefcase className={styles.inputIcon} size={18} />
              </div>
              
              <div className={styles.infoBox}>
                {role === 'investidor' ? (
                  <>
                    💼 <strong>Investidor:</strong> Aceda a startups qualificadas, consulte pitch decks detalhados e envie propostas de financiamento na nossa plataforma.
                  </>
                ) : (
                  <>
                    🚀 <strong>Empreendedor / Startup:</strong> Registe a sua startup, aceda a cursos certificados exclusivos e solicite mentorias no ABN Hub.
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 3. CONTACTO E LOCALIZAÇÃO */}
          <div className={styles.stepDivider}>
            <h3 className={styles.sectionTitle}>
              <span>3.</span> Contacto e Localização
            </h3>
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
                  <label>País</label>
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
                <label>Cidade</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    placeholder="Ex: Bissau, Maputo, Lisboa..."
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                  <MapPin className={styles.inputIcon} size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* 4. PERFIL PROFISSIONAL */}
          <div style={{ marginBottom: '0.5rem' }}>
            <h3 className={styles.sectionTitle}>
              <span>4.</span> Perfil Profissional
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

              <div className={styles.inputGroup}>
                <label>LinkedIn</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/seuperfil"
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                  />
                  <Link2 className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>
                  {role === 'investidor' ? 'O que procura investir / Ticket médio' : 'O que faz / O que procura'}
                </label>
                <div className={styles.inputWrapper}>
                  <textarea
                    placeholder={role === 'investidor'
                      ? 'Ex: Invisto em startups de Agro-Tech na África Lusófona com tickets entre 10k-100k USD...'
                      : 'Ex: Desenvolvemos uma plataforma de pagamentos para agricultores rurais em Moçambique...'}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={3}
                    style={{ paddingLeft: '44px' }}
                  />
                  <FileText className={styles.inputIcon} size={18} style={{ alignSelf: 'flex-start', marginTop: '12px' }} />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ marginTop: '1rem', padding: '14px 20px', width: '100%', fontSize: '0.95rem' }}
          >
            {loading ? 'A criar conta...' : 'Criar Conta Gratuita →'}
          </button>
        </form>

        <p className={styles.footerText}>
          Já tem uma conta? <Link href="/login" className="text-gradient-gold">Faça login</Link>
        </p>
      </div>
    </div>
  );
}
