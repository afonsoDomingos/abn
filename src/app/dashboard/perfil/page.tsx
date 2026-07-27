'use client';

import { useEffect, useState } from 'react';
import styles from './Perfil.module.css';

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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  phone?: string;
  country?: string;
  city?: string;
  company?: string;
  sector?: string;
  linkedin?: string;
  bio?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  passportBioPage?: string;
  passportPhoto?: string;
  educationLevel?: string;
  howHeardAboutUs?: string;
}

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [company, setCompany] = useState('');
  const [sector, setSector] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [bio, setBio] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportBioPage, setPassportBioPage] = useState('');
  const [passportPhoto, setPassportPhoto] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [howHeardAboutUs, setHowHeardAboutUs] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadingBio, setUploadingBio] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          const u = data.user;
          setUser({ id: u._id || u.id, ...u });
          setName(u.name || '');
          setEmail(u.email || '');
          setProfileImage(u.profileImage || '');
          setPhone(u.phone || '');
          setCountry(u.country || '');
          setCity(u.city || '');
          setCompany(u.company || '');
          setSector(u.sector || '');
          setLinkedin(u.linkedin || '');
          setBio(u.bio || '');
          setBirthDate(u.birthDate || '');
          setGender(u.gender || '');
          setNationality(u.nationality || '');
          setPassportBioPage(u.passportBioPage || '');
          setPassportPhoto(u.passportPhoto || '');
          setEducationLevel(u.educationLevel || '');
          setHowHeardAboutUs(u.howHeardAboutUs || '');
        } else {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            const u = JSON.parse(savedUser);
            setUser(u);
            setName(u.name || '');
            setEmail(u.email || '');
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleFileUpload = async (file: File, type: 'avatar' | 'passportBio' | 'passportPhoto') => {
    const formData = new FormData();
    formData.append('file', file);

    if (type === 'avatar') setUploading(true);
    else if (type === 'passportBio') setUploadingBio(true);
    else setUploadingPhoto(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (type === 'avatar') setProfileImage(data.url);
        else if (type === 'passportBio') setPassportBioPage(data.url);
        else setPassportPhoto(data.url);
        
        setMsg({ type: 'success', text: 'Ficheiro carregado com sucesso! Clique em Guardar Alterações para salvar.' });
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao carregar ficheiro.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro de ligação ao carregar ficheiro.' });
    } finally {
      if (type === 'avatar') setUploading(false);
      else if (type === 'passportBio') setUploadingBio(false);
      else setUploadingPhoto(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name,
          email,
          profileImage,
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
          howHeardAboutUs,
          password: password || undefined
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setPassword('');
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao atualizar perfil.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>A carregar...</div>;
  if (!user) return <div className={styles.error}>Acesso negado. Por favor, faça login.</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className="text-gradient-gold">O Meu Perfil</h1>
        <p>Gira as tuas informações pessoais, profissionais e credenciais de acesso.</p>
      </header>

      <div className={styles.container}>
        <div className={`glass ${styles.card}`}>
          <div className={styles.avatarSection} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                className={styles.avatar}
                style={profileImage ? { backgroundImage: `url('${profileImage}')`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : {}}
              >
                {!profileImage && name.charAt(0).toUpperCase()}
              </div>
              <label style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>
                {uploading ? 'A enviar...' : 'Alterar Foto'}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, 'avatar');
                  }} 
                  style={{ display: 'none' }} 
                />
              </label>
            </div>
            <div className={styles.info}>
              <h3>{name}</h3>
              <span className={styles.roleBadge}>{user.role}</span>
            </div>
          </div>

          {msg.text && (
            <div className={`${styles.alert} ${styles[msg.type]}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className={styles.form}>
            {/* Dados Pessoais & Conta */}
            <h4 style={{ margin: '1rem 0 0.5rem 0', color: 'var(--primary)', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem' }}>
              👤 Identificação & Acesso
            </h4>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Nome Completo *</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className={styles.field}>
                <label>Email *</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Data de Nascimento</label>
                <input 
                  type="date"
                  value={birthDate} 
                  onChange={e => setBirthDate(e.target.value)} 
                />
              </div>
              <div className={styles.field}>
                <label>Género</label>
                <select value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="">Seleccionar género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                  <option value="Prefiro não responder">Prefiro não responder</option>
                </select>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Nacionalidade</label>
                <select value={nationality} onChange={e => setNationality(e.target.value)}>
                  <option value="">Seleccionar nacionalidade</option>
                  {NATIONALITIES.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>País de Residência</label>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                  <option value="">Seleccionar país</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Cidade</label>
                <input 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                  placeholder="Ex: Bissau, Maputo, Luanda..."
                />
              </div>
              <div className={styles.field}>
                <label>WhatsApp / Telefone</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="+245 96 123 4567"
                />
              </div>
            </div>

            {/* Perfil Profissional */}
            <h4 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--primary)', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem' }}>
              🏢 Perfil Profissional & Académico
            </h4>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Empresa / Startup</label>
                <input 
                  value={company} 
                  onChange={e => setCompany(e.target.value)} 
                  placeholder="Nome da Empresa"
                />
              </div>
              <div className={styles.field}>
                <label>Sector de Actividade</label>
                <select value={sector} onChange={e => setSector(e.target.value)}>
                  <option value="">Seleccionar sector</option>
                  {SECTORS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Nível Máximo de Escolaridade</label>
                <select value={educationLevel} onChange={e => setEducationLevel(e.target.value)}>
                  <option value="">Seleccionar escolaridade</option>
                  {EDUCATION_LEVELS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Como ficou a saber sobre a ABN?</label>
                <select value={howHeardAboutUs} onChange={e => setHowHeardAboutUs(e.target.value)}>
                  <option value="">Seleccionar opção</option>
                  {HEARD_ABOUT_SOURCES.map(src => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label>LinkedIn</label>
                <input 
                  type="url" 
                  value={linkedin} 
                  onChange={e => setLinkedin(e.target.value)} 
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Biografia / Breve Descrição</label>
              <textarea 
                rows={3} 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                placeholder="Conte-nos brevemente sobre si ou sobre o seu negócio..."
              />
            </div>

            {/* Documentação */}
            <h4 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--primary)', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem' }}>
              📄 Documentos do Passaporte
            </h4>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Página de Dados do Passaporte</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    value={passportBioPage} 
                    onChange={e => setPassportBioPage(e.target.value)} 
                    placeholder="URL do ficheiro ou carregue abaixo"
                    style={{ flex: 1 }}
                  />
                  <label style={{ background: '#f5f5f4', border: '1px solid #d6d3d1', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    {uploadingBio ? '⏳...' : '📁 Subir'}
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'passportBio');
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {passportBioPage && (
                  <a href={passportBioPage} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--primary)', textDecoration: 'underline', marginTop: '2px' }}>
                    🔗 Ver documento carregado
                  </a>
                )}
              </div>

              <div className={styles.field}>
                <label>Fotografia do Passaporte</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    value={passportPhoto} 
                    onChange={e => setPassportPhoto(e.target.value)} 
                    placeholder="URL da foto ou carregue abaixo"
                    style={{ flex: 1 }}
                  />
                  <label style={{ background: '#f5f5f4', border: '1px solid #d6d3d1', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    {uploadingPhoto ? '⏳...' : '📷 Subir'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'passportPhoto');
                      }}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                {passportPhoto && (
                  <a href={passportPhoto} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--primary)', textDecoration: 'underline', marginTop: '2px' }}>
                    📷 Ver foto do passaporte
                  </a>
                )}
              </div>
            </div>

            {/* Palavra-passe */}
            <h4 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--primary)', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem' }}>
              🔒 Segurança
            </h4>
            <div className={styles.field}>
              <label>Nova Senha (deixe em branco para manter a atual)</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className={styles.actions}>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'A guardar...' : 'Guardar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
