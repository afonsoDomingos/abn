import Link from 'next/link';

interface FooterProps {
  shopEnabled?: boolean;
}

export default function Footer({ shopEnabled = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      padding: '3rem 1.5rem 2rem',
      fontSize: '0.85rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {/* Coluna 1: Informação Legal */}
        <div>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '1rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            ABN – AfroBiz Network
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ margin: 0 }}>
              <strong>Afrobiz Network ABN, SU, Lda</strong>
            </p>
            <p style={{ margin: 0 }}>
              N.º único de entidade legal: 105074664
            </p>
            <p style={{ margin: 0 }}>
              NUIT: 402200456
            </p>
            <p style={{ margin: 0, marginTop: '0.75rem' }}>
              Av. Maria de Lurdes Mutola, Q.60, casa n.º 01,<br />
              Magoanine A, KaMubukwana, Maputo, Moçambique
            </p>
          </div>
        </div>

        {/* Coluna 2: Contactos */}
        <div>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '1rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Contactos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ margin: 0 }}>
              <a href="mailto:info@abnafrobiznetwork.com" style={{ color: '#de9b35', textDecoration: 'none' }}>
                info@abnafrobiznetwork.com
              </a>
            </p>
            <p style={{ margin: 0 }}>
              <a href="tel:+258845773974" style={{ color: '#de9b35', textDecoration: 'none' }}>
                WhatsApp: +258 84 577 3974
              </a>
            </p>
          </div>
        </div>

        {/* Coluna 3: Representações */}
        <div>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '1rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Representações Nacionais
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ margin: 0 }}>Angola</p>
            <p style={{ margin: 0 }}>Guiné-Bissau</p>
            <p style={{ margin: 0 }}>São Tomé e Príncipe</p>
            <p style={{ margin: 0 }}>Cabo Verde</p>
          </div>
        </div>

        {/* Coluna 4: Links Legais */}
        <div>
          <h3 style={{
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '1rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Legal
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/termos" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Termos de Uso
            </Link>
            <Link href="/privacidade" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>

      {/* Linha inferior */}
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto 0',
        paddingTop: '1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#64748b' }}>
          Copyright © ABN {currentYear}
        </p>
        {!shopEnabled && (
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>
            Powered By{' '}
            <a
              href="https://www.wehosthere.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#de9b35', textDecoration: 'none', fontWeight: 600 }}
            >
              Wehosthere
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}