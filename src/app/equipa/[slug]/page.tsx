import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import ScrollToTop from '@/components/ScrollToTop';
import styles from '../Equipa.module.css';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  country?: string;
  bio: string;
  expertise: string[];
  responsibilities: string[];
  image: string;
  linkedin: string;
  email: string;
  website?: string;
  phone?: string;
  order: number;
  status: string;
}

async function getTeamMember(slug: string): Promise<TeamMember | null> {
  try {
    const res = await fetch('/api/team', {
      cache: 'no-store'
    });
    const data = await res.json();

    if (data.team && data.team.length > 0) {
      const member = data.team.find((m: TeamMember) => {
        const nameSlug = m.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return nameSlug === slug || m._id === slug;
      });

      return member || null;
    }
    return null;
  } catch (error) {
    return null;
  }
}

function getRoleMeta(role: string): { color: string; bg: string } {
  const r = role.toLowerCase();
  if (r.includes('ceo') || r.includes('director') || r.includes('directora') || r.includes('presidente') || r.includes('fundador') || r.includes('co-fundador'))
    return { color: '#c2410c', bg: 'rgba(194,65,12,0.08)' };
  if (r.includes('tech') || r.includes('desenvolv') || r.includes('developer') || r.includes('cto') || r.includes('inovação') || r.includes('tecnologia'))
    return { color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)' };
  if (r.includes('rh') || r.includes('recursos') || r.includes('humanos') || r.includes('people') || r.includes('adjunto') || r.includes('adjunta'))
    return { color: '#15803d', bg: 'rgba(21,128,61,0.08)' };
  if (r.includes('market') || r.includes('comunic') || r.includes('design') || r.includes('assistente'))
    return { color: '#b45309', bg: 'rgba(180,83,9,0.08)' };
  if (r.includes('financ') || r.includes('cfo') || r.includes('contab') || r.includes('administra'))
    return { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' };
  if (r.includes('meal') || r.includes('monitoria') || r.includes('avalia'))
    return { color: '#0e7490', bg: 'rgba(14,116,144,0.08)' };
  if (r.includes('invest') || r.includes('parceria'))
    return { color: '#be185d', bg: 'rgba(190,24,93,0.08)' };
  return { color: '#ff6b00', bg: 'rgba(255,107,0,0.08)' };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getTeamMember(slug);

  if (!member) {
    notFound();
  }

  const { color, bg } = getRoleMeta(member.role);
  const nameSlug = member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.memberHero}>
          <div className={styles.memberHeroContent}>
            <a href="/equipa" className={styles.backLink}>
              ← Voltar à Equipa
            </a>
            
            <div className={styles.memberHeader}>
              <div className={styles.memberImageContainer}>
                <img
                  src={member.image && member.image.trim() ? member.image : '/abn-logo.png'}
                  alt={member.name}
                  className={styles.memberImage}
                  style={
                    !member.image || !member.image.trim()
                      ? { objectFit: 'contain', padding: '24px', background: '#0d1322' }
                      : { objectFit: 'cover' }
                  }
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/abn-logo.png';
                    target.style.objectFit = 'contain';
                    target.style.padding = '24px';
                    target.style.background = '#0d1322';
                  }}
                />
              </div>
              
              <div className={styles.memberInfo}>
                <span
                  className={styles.roleBadge}
                  style={{ color, background: bg, borderColor: `${color}33` }}
                >
                  {member.role}
                </span>
                <h1 className={styles.memberName}>{member.name}</h1>
                {member.department && (
                  <p className={styles.memberDepartment}>{member.department}</p>
                )}
                <p className={styles.memberCountry}>
                  {member.country || 'Moçambique'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.memberContainer}>
          <div className={styles.memberContent}>
            {/* Bio Section */}
            <div className={styles.memberSection}>
              <h2>Sobre</h2>
              <p className={styles.memberBio}>{member.bio}</p>
            </div>

            {/* Responsibilities */}
            {member.responsibilities && member.responsibilities.length > 0 && (
              <div className={styles.memberSection}>
                <h2>Responsabilidades</h2>
                <ul className={styles.memberList}>
                  {member.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Expertise */}
            {member.expertise && member.expertise.length > 0 && (
              <div className={styles.memberSection}>
                <h2>Expertise</h2>
                <div className={styles.memberTags}>
                  {member.expertise.map((exp, i) => (
                    <span key={i} className={styles.memberTag}>{exp}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Links */}
            <div className={styles.memberSection}>
              <h2>Contacto</h2>
              <div className={styles.memberContact}>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    LinkedIn
                  </a>
                )}
                {member.website && (
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    Website / Portfólio
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className={styles.contactLink}
                  >
                    E-mail
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`https://wa.me/${member.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLink}
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <FloatingWhatsApp />
      <ScrollToTop />
      <Footer />
    </>
  );
}