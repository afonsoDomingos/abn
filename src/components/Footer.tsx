import Link from 'next/link';

interface FooterProps {
  shopEnabled?: boolean;
}

export default function Footer({ shopEnabled = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      background: '#ffffff',
      color: '#0f172a',
      padding: '0.6rem 1.5rem 0.4rem',
      fontSize: '0.7rem',
      borderTop: '1px solid #e2e8f0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.6rem'
      }}>
        {/* Coluna 1: Informação Legal */}
        <div>
          <h3 style={{
            color: '#0f172a',
            fontSize: '0.7rem',
            fontWeight: 700,
            marginBottom: '0.3rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            ABN – AfroBiz Network
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <p style={{ margin: 0, fontSize: '0.65rem' }}>
              <strong>AFROBIZ NETWORK ABN, SU, LDA</strong>
            </p>
            <p style={{ margin: 0, fontSize: '0.65rem' }}>
              NUIT: 402200456
            </p>
            <p style={{ margin: 0, fontSize: '0.65rem' }}>
              Maputo, Moçambique
            </p>
          </div>
        </div>

        {/* Coluna 2: Contactos */}
        <div>
          <h3 style={{
            color: '#0f172a',
            fontSize: '0.7rem',
            fontWeight: 700,
            marginBottom: '0.3rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Contactos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <p style={{ margin: 0, fontSize: '0.65rem' }}>
              <a href="mailto:info@abnafrobiznetwork.com" style={{ color: '#0f172a', textDecoration: 'none' }}>
                info@abnafrobiznetwork.com
              </a>
            </p>
            <p style={{ margin: 0, fontSize: '0.65rem' }}>
              <a href="tel:+258845773974" style={{ color: '#0f172a', textDecoration: 'none' }}>
                +258 84 577 3974
              </a>
            </p>
          </div>
        </div>

        {/* Coluna 3: Representações */}
        <div>
          <h3 style={{
            color: '#0f172a',
            fontSize: '0.7rem',
            fontWeight: 700,
            marginBottom: '0.3rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Representações
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <p style={{ margin: 0, fontSize: '0.65rem' }}>Angola</p>
            <p style={{ margin: 0, fontSize: '0.65rem' }}>Guiné-Bissau</p>
            <p style={{ margin: 0, fontSize: '0.65rem' }}>São Tomé e Príncipe</p>
            <p style={{ margin: 0, fontSize: '0.65rem' }}>Cabo Verde</p>
          </div>
        </div>

        {/* Coluna 4: Links Legais */}
        <div>
          <h3 style={{
            color: '#0f172a',
            fontSize: '0.7rem',
            fontWeight: 700,
            marginBottom: '0.3rem',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Legal
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <Link href="/termos" style={{ color: '#0f172a', textDecoration: 'none', fontSize: '0.65rem' }}>
              Termos de Uso
            </Link>
            <Link href="/privacidade" style={{ color: '#0f172a', textDecoration: 'none', fontSize: '0.65rem' }}>
              Política de Privacidade
            </Link>
            <Link href="/loja/termos" style={{ color: '#0f172a', textDecoration: 'none', fontSize: '0.65rem' }}>
              Termos da Loja
            </Link>
          </div>
        </div>
      </div>

      {/* Linha inferior */}
      <div style={{
        maxWidth: '1200px',
        margin: '0.5rem auto 0',
        paddingTop: '0.5rem',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.65rem' }}>
          Copyright © ABN {currentYear}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b', fontSize: '0.75rem' }}>
          <span>Powered By</span>
          <a
            href="https://www.wehosthere.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              color: '#0f172a', 
              textDecoration: 'none', 
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <img 
              src="/wehosthere.png" 
              alt="Wehosthere" 
              style={{ 
                height: '24px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <span>Wehosthere</span>
          </a>
        </div>
      </div>
    </footer>
  );
}