'use client';

import { useEffect, useState } from 'react';
import { 
  User as UserIcon, 
  Globe2, 
  MapPin, 
  Phone, 
  Building2, 
  Briefcase, 
  Share2, 
  FileText, 
  Award, 
  ShieldCheck, 
  Check, 
  ExternalLink,
  Rocket,
  Zap,
  TrendingUp,
  Compass,
  Target,
  Handshake,
  GraduationCap,
  Landmark
} from 'lucide-react';
import styles from './Perfil.module.css';

const PROFILE_CATEGORIES = [
  { id: 'empreendedor', title: 'Empreendedor', icon: Rocket },
  { id: 'startup', title: 'Startup', icon: Zap },
  { id: 'empresa', title: 'Empresa / PME', icon: Building2 },
  { id: 'investidor', title: 'Investidor', icon: TrendingUp },
  { id: 'mentor', title: 'Mentor', icon: Compass },
  { id: 'consultor', title: 'Consultor / Especialista', icon: Target },
  { id: 'parceiro', title: 'Parceiro', icon: Handshake },
  { id: 'universidade', title: 'Universidade / Academia', icon: GraduationCap },
  { id: 'incubadora', title: 'Incubadora / Aceleradora', icon: Landmark },
  { id: 'organizacao', title: 'Organização / Instituição', icon: Globe2 }
];

const SECTORS = [
  'Tecnologia e Software', 'Fintech e Finanças', 'Agro-negócio & Pescas', 'Saúde e Bem-estar',
  'Educação & EdTech', 'Comércio e Retalho', 'Construção e Imobiliário', 'Energia e Ambiente',
  'Transportes e Logística', 'Turismo e Hotelaria', 'Média e Comunicação', 'Consultoria e Gestão', 'Outro'
];

const INTERESTS_OPTIONS = [
  'Captação de Investimento', 'Networking & Parcerias', 'Mentoria Estratégica',
  'Incubação e Aceleração', 'Cursos & Formação', 'Transformação Digital',
  'Acesso a Novos Mercados', 'Inovação Aberta', 'Contratação de Talentos', 'Comércio Internacional'
];

const LANGUAGES_OPTIONS = [
  'Português', 'Inglês', 'Francês', 'Espanhol', 'Mandarim', 'Árabe'
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

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  roles?: string[];
  profileImage?: string;
  phone?: string;
  country?: string;
  city?: string;
  company?: string;
  sector?: string;
  sectors?: string[];
  website?: string;
  linkedin?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  bio?: string;
  interests?: string[];
  languages?: string[];
  experience?: string;
  skills?: string[];
  birthDate?: string;
  gender?: string;
  nationality?: string;
  passportBioPage?: string;
  passportPhoto?: string;
  educationLevel?: string;
  howHeardAboutUs?: string;
}

export default function PerfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  
  // Categorias / Perfis
  const [roles, setRoles] = useState<string[]>(['empreendedor']);
  const [role, setRole] = useState('empreendedor');

  // Contactos & Localização
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Angola');
  const [city, setCity] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');

  // Redes Sociais
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');

  // Perfil Profissional
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [sector, setSector] = useState('');
  const [sectors, setSectors] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>(['Português']);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Dados Pessoais & Documentos
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportBioPage, setPassportBioPage] = useState('');
  const [passportPhoto, setPassportPhoto] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [howHeardAboutUs, setHowHeardAboutUs] = useState('');

  // Upload & Submissão
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
          
          const userRoles = Array.isArray(u.roles) && u.roles.length > 0 ? u.roles : [u.role || 'empreendedor'];
          setRoles(userRoles);
          setRole(u.role || userRoles[0]);

          setPhone(u.phone || '');
          setCountry(u.country || 'Angola');
          setCity(u.city || '');
          setCompany(u.company || '');
          setWebsite(u.website || '');
          setSector(u.sector || '');
          setSectors(Array.isArray(u.sectors) ? u.sectors : (u.sector ? [u.sector] : []));
          setLinkedin(u.linkedin || u.socialLinks?.linkedin || '');
          setTwitter(u.socialLinks?.twitter || '');
          setInstagram(u.socialLinks?.instagram || '');
          setBio(u.bio || '');
          setExperience(u.experience || '');
          setInterests(Array.isArray(u.interests) ? u.interests : []);
          setLanguages(Array.isArray(u.languages) ? u.languages : ['Português']);
          setSkills(Array.isArray(u.skills) ? u.skills : []);
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

  const toggleRole = (catId: string) => {
    let nextRoles: string[];
    if (roles.includes(catId)) {
      if (roles.length === 1) {
        setMsg({ type: 'error', text: 'Deve manter pelo menos uma categoria ativa.' });
        return;
      }
      nextRoles = roles.filter(r => r !== catId);
    } else {
      nextRoles = [...roles, catId];
    }
    setRoles(nextRoles);
    if (!nextRoles.includes(role)) {
      setRole(nextRoles[0]);
    }
  };

  const toggleInterest = (item: string) => {
    setInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleLanguage = (lang: string) => {
    setLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const addSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setNewSkillInput('');
    }
  };

  const removeSkill = (sk: string) => {
    setSkills(prev => prev.filter(s => s !== sk));
  };

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
          role,
          roles,
          profileImage,
          phone,
          country,
          city,
          company,
          sector,
          sectors,
          website,
          linkedin,
          socialLinks: {
            linkedin,
            twitter,
            instagram
          },
          bio,
          interests,
          languages,
          experience,
          skills,
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
        setMsg({ type: 'success', text: '✅ Perfil profissional atualizado com sucesso!' });
        const updatedUser = { 
          ...data.user, 
          profileImage: profileImage || data.user.profileImage,
          roles,
          role
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        localStorage.setItem('abn_active_role', role);
        setUser(updatedUser);
        setPassword('');
        window.dispatchEvent(new Event('abn_role_changed'));
        window.dispatchEvent(new Event('user-profile-updated'));
      } else {
        setMsg({ type: 'error', text: data.error || 'Erro ao atualizar perfil.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.loading}>A carregar o seu perfil...</div>;
  if (!user) return <div className={styles.error}>Acesso negado. Por favor, faça login.</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', background: 'rgba(255,107,0,0.1)', color: '#ff6b00', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
          <ShieldCheck size={14} /> Perfil Profissional
        </div>
        <h1 className="text-gradient-gold">Gestão de Perfil</h1>
        <p>Gira as suas informações profissionais, categorias ativas na rede, redes sociais e credenciais.</p>
      </header>

      <div className={styles.container}>
        <div className={`glass ${styles.card}`}>
          
          {/* Top User Card */}
          <div className={styles.avatarSection} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                className={styles.avatar}
                style={profileImage ? { backgroundImage: `url('${profileImage}')`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : {}}
              >
                {!profileImage && name.charAt(0).toUpperCase()}
              </div>
              <label style={{ fontSize: '0.8rem', color: 'var(--primary, #ff6b00)', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}>
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

            <div className={styles.info} style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.35rem', color: '#0f172a' }}>{name}</h3>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                {roles.map(r => {
                  const cat = PROFILE_CATEGORIES.find(c => c.id === r);
                  const IconComp = cat?.icon;
                  return (
                    <span key={r} style={{ background: '#0f172a', color: '#ffffff', padding: '3px 10px', borderRadius: '50px', fontSize: '0.74rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      {IconComp && <IconComp size={12} style={{ color: '#ff6b00' }} />}
                      <span>{cat?.title}</span>
                      {r === role && <span style={{ color: '#ff6b00' }}>★</span>}
                    </span>
                  );
                })}
              </div>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                {email} • {city ? `${city}, ` : ''}{country}
              </p>
            </div>
          </div>

          {msg.text && (
            <div className={`${styles.alert} ${styles[msg.type]}`} style={{ marginTop: '1.25rem' }}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className={styles.form}>

            {/* 1. Categorias de Atuação (Multi-Perfil) */}
            <h4 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--primary, #ff6b00)', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} /> Categorias de Atuação na ABN (Multi-Perfil)
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 0.75rem 0' }}>
              Selecione uma ou mais categorias que definem a sua atuação (ex: Empreendedor + Investidor + Mentor).
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
              {PROFILE_CATEGORIES.map(category => {
                const isSelected = roles.includes(category.id);
                return (
                  <div
                    key={category.id}
                    onClick={() => toggleRole(category.id)}
                    style={{
                      border: isSelected ? '1.5px solid #ff6b00' : '1px solid #cbd5e1',
                      background: isSelected ? '#fff7ed' : '#ffffff',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <category.icon size={16} color={isSelected ? '#ff6b00' : '#64748b'} />
                      <span>{category.title}</span>
                    </span>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: isSelected ? '1.5px solid #ff6b00' : '1.5px solid #cbd5e1',
                      background: isSelected ? '#ff6b00' : '#ffffff',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem'
                    }}>
                      {isSelected && <Check size={12} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {roles.length > 1 && (
              <div className={styles.field} style={{ marginBottom: '1.25rem' }}>
                <label>Perfil Principal Preferencial</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  {roles.map(r => {
                    const cat = PROFILE_CATEGORIES.find(c => c.id === r);
                    return <option key={r} value={r}>{cat?.title || r}</option>;
                  })}
                </select>
              </div>
            )}

            {/* 2. Identificação & Contactos */}
            <h4 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--primary, #ff6b00)', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserIcon size={18} /> Identificação &amp; Contactos
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
                <label>Telefone / WhatsApp *</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="+244 923 000 000"
                />
              </div>
              <div className={styles.field}>
                <label>Website ou Portfólio</label>
                <input 
                  type="url" 
                  value={website} 
                  onChange={e => setWebsite(e.target.value)} 
                  placeholder="https://exemplo.com"
                />
              </div>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label>País de Residência</label>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Cidade</label>
                <input 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                  placeholder="Ex: Luanda, Maputo, Lisboa..."
                />
              </div>
            </div>

            {/* 3. Redes Sociais */}
            <h4 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--primary, #ff6b00)', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Share2 size={18} /> Presença Digital &amp; Redes Sociais
            </h4>
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
              <div className={styles.field}>
                <label>Twitter / X ou Instagram</label>
                <input 
                  type="text" 
                  value={twitter || instagram} 
                  onChange={e => {
                    setTwitter(e.target.value);
                    setInstagram(e.target.value);
                  }} 
                  placeholder="@seu_utilizador"
                />
              </div>
            </div>

            {/* 4. Perfil Profissional, Setores & Competências */}
            <h4 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--primary, #ff6b00)', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} /> Biografia, Setores &amp; Competências
            </h4>
            
            <div className={styles.field}>
              <label>Biografia Profissional</label>
              <textarea 
                rows={3} 
                value={bio} 
                onChange={e => setBio(e.target.value)} 
                placeholder="Conte sobre a sua trajetória, projetos e o que procura na ABN..."
              />
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Empresa / Organização Principal</label>
                <input 
                  value={company} 
                  onChange={e => setCompany(e.target.value)} 
                  placeholder="Nome da Empresa"
                />
              </div>
              <div className={styles.field}>
                <label>Experiência Profissional</label>
                <select value={experience} onChange={e => setExperience(e.target.value)}>
                  <option value="Menos de 1 ano">Menos de 1 ano</option>
                  <option value="1 a 3 anos">1 a 3 anos</option>
                  <option value="3 a 5 anos de experiência">3 a 5 anos de experiência</option>
                  <option value="5 a 10 anos">5 a 10 anos (Sénior / Líder)</option>
                  <option value="Mais de 10 anos">Mais de 10 anos (Especialista / C-Level)</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>Sector Principal de Actividade</label>
              <select value={sector} onChange={e => setSector(e.target.value)}>
                <option value="">Seleccionar sector</option>
                {SECTORS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Áreas de Interesse */}
            <div className={styles.field}>
              <label>Áreas de Interesse na Plataforma</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {INTERESTS_OPTIONS.map(item => {
                  const active = interests.includes(item);
                  return (
                    <span
                      key={item}
                      onClick={() => toggleInterest(item)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '50px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: active ? '#ff6b00' : '#f1f5f9',
                        color: active ? '#ffffff' : '#475569',
                        border: active ? '1px solid #ff6b00' : '1px solid #cbd5e1'
                      }}
                    >
                      {item}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Idiomas */}
            <div className={styles.field}>
              <label>Idiomas Falados</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                {LANGUAGES_OPTIONS.map(lang => {
                  const active = languages.includes(lang);
                  return (
                    <span
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '50px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: active ? '#ff6b00' : '#f1f5f9',
                        color: active ? '#ffffff' : '#475569',
                        border: active ? '1px solid #ff6b00' : '1px solid #cbd5e1'
                      }}
                    >
                      {lang}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Competências */}
            <div className={styles.field}>
              <label>Competências &amp; Skills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {skills.map(sk => (
                  <span
                    key={sk}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '50px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {sk}
                    <button
                      type="button"
                      onClick={() => removeSkill(sk)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem', lineHeight: 1 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text"
                  placeholder="Adicionar competência (ex: Inteligência Artificial)..."
                  value={newSkillInput}
                  onChange={e => setNewSkillInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  style={{ padding: '8px 16px', background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Adicionar
                </button>
              </div>
            </div>

            {/* 5. Segurança */}
            <h4 style={{ margin: '1.5rem 0 0.5rem 0', color: 'var(--primary, #ff6b00)', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem' }}>
              🔒 Segurança &amp; Acesso
            </h4>
            <div className={styles.field}>
              <label>Nova Palavra-passe (deixe em branco para manter a atual)</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className={styles.actions} style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn-primary" disabled={saving} style={{ padding: '14px 28px', fontWeight: 800, fontSize: '0.95rem' }}>
                {saving ? 'A guardar alterações...' : 'Guardar Alterações do Perfil'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
