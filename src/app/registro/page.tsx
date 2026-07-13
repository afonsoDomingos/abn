'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Auth.module.css';

const SECTORS = [
  'Agro-negocio', 'Tecnologia e Software', 'Fintech e Financas', 'Saude e Bem-estar',
  'Educacao', 'Comercio e Retalho', 'Construcao e Imobiliario', 'Energia e Ambiente',
  'Transportes e Logistica', 'Turismo e Hotelaria', 'Media e Comunicacao',
  'Moda e Textil', 'Alimentacao e Bebidas', 'Consultoria e Servicos', 'Outro'
];

const COUNTRIES = [
  'Angola', 'Cabo Verde', 'Guine-Bissau', 'Mocambique', 'Portugal',
  'Sao Tome e Principe', 'Brasil', 'Franca', 'Espanha', 'Outro'
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
        body: JSON.stringify({ name, email, password, role, phone, country, city, company, sector, linkedin, bio }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Erro ao registar');
      }
    } catch (err) {
      setError('Erro de conexao');
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    padding: '11px 14px',
    color: '#fff',
    width: '100%',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    boxSizing: 'border-box',
  };

  const lbl: React.CSSProperties = {
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '5px',
    display: 'block',
  };

  const fg = (label: string, required: boolean, children: React.ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <label style={lbl}>
        {label}{' '}
        {required
          ? <span style={{ color: 'var(--primary)' }}>*</span>
          : <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400, textTransform: 'none' }}>(opcional)</span>}
      </label>
      {children}
    </div>
  );

  const sectionTitle = (num: string, title: string) => (
    <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.1em', margin: '0 0 1rem 0' }}>
      {num}. {title}
    </p>
  );

  const divider: React.CSSProperties = { borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '1.2rem', marginBottom: '0.2rem' };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard} style={{ maxWidth: '560px' }}>
        <Link href="/" className={styles.backHome}>&#8592; Voltar ao Site</Link>
        <div className={styles.header}>
          <h1 className="text-gradient-gold">Junte-se a Rede</h1>
          <p>Comece a sua jornada empresarial hoje.</p>
        </div>

        {error && (
          <div style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem', background: 'rgba(255,77,77,0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,77,77,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

          {/* 1. Dados de Acesso */}
          <div style={divider}>
            {sectionTitle('1', 'Dados de Acesso')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {fg('Nome Completo', true, <input style={inp} type="text" placeholder="O seu nome completo" value={name} onChange={e => setName(e.target.value)} required />)}
              {fg('Email', true, <input style={inp} type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />)}
              {fg('Palavra-passe', true, <>
                <input style={inp} type="password" placeholder="Minimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required />
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Minimo 6 caracteres</span>
              </>)}
            </div>
          </div>

          {/* 2. Tipo de Perfil */}
          <div style={divider}>
            {sectionTitle('2', 'Tipo de Perfil')}
            {fg('Tipo de Conta', true, <>
              <select style={{ ...inp, cursor: 'pointer' }} value={role} onChange={e => setRole(e.target.value)} required>
                <option value="empreendedor">Empreendedor / Startup</option>
                <option value="investidor">Investidor</option>
              </select>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.8rem', color: '#d6d3d1', lineHeight: 1.5 }}>
                {role === 'investidor'
                  ? <><span>&#x1F4BC;</span> <strong>Investidor:</strong> Aceda a startups qualificadas, consulte pitch decks e envie propostas de financiamento.</>
                  : <><span>&#x1F680;</span> <strong>Empreendedor / Startup:</strong> Registe a sua startup, aceda a cursos certificados e solicite apoio ao ABN Hub.</>}
              </div>
            </>)}
          </div>

          {/* 3. Contacto e Localizacao */}
          <div style={divider}>
            {sectionTitle('3', 'Contacto e Localizacao')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {fg('WhatsApp / Telefone', false, <input style={inp} type="tel" placeholder="+245 96 123 4567" value={phone} onChange={e => setPhone(e.target.value)} />)}
                {fg('Pais', false,
                  <select style={{ ...inp, cursor: 'pointer' }} value={country} onChange={e => setCountry(e.target.value)}>
                    <option value="">Seleccionar pais</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                )}
              </div>
              {fg('Cidade', false, <input style={inp} type="text" placeholder="Ex: Bissau, Maputo, Lisboa..." value={city} onChange={e => setCity(e.target.value)} />)}
            </div>
          </div>

          {/* 4. Perfil Profissional */}
          <div>
            {sectionTitle('4', 'Perfil Profissional')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {fg(role === 'investidor' ? 'Empresa / Fundo' : 'Empresa / Startup', false,
                  <input style={inp} type="text" placeholder={role === 'investidor' ? 'Ex: Fundo Africa Growth' : 'Ex: AgriTech Solutions'} value={company} onChange={e => setCompany(e.target.value)} />
                )}
                {fg('Sector de Actividade', false,
                  <select style={{ ...inp, cursor: 'pointer' }} value={sector} onChange={e => setSector(e.target.value)}>
                    <option value="">Seleccionar sector</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
              {fg('LinkedIn', false, <input style={inp} type="url" placeholder="https://linkedin.com/in/seuperfil" value={linkedin} onChange={e => setLinkedin(e.target.value)} />)}
              {fg(role === 'investidor' ? 'O que procura investir / Ticket medio' : 'O que faz / O que procura', false,
                <textarea
                  style={{ ...inp, resize: 'vertical', minHeight: '80px', lineHeight: '1.5' } as React.CSSProperties}
                  placeholder={role === 'investidor'
                    ? 'Ex: Invisto em startups de Agro-Tech na Africa Lusofona com tickets entre 10k-100k USD...'
                    : 'Ex: Desenvolvemos uma plataforma de pagamentos para agricultores rurais em Mocambique...'}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={3}
                />
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem', padding: '14px' }}>
            {loading ? 'A criar conta...' : 'Criar Conta Gratuita \u2192'}
          </button>
        </form>

        <p className={styles.footerText}>
          Ja tem uma conta? <Link href="/login" className="text-gradient-gold">Faca login</Link>
        </p>
      </div>
    </div>
  );
}
