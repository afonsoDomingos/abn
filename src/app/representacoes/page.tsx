import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import styles from './page.module.css';
import 'flag-icons/css/flag-icons.min.css';

const countries = [
  {
    name: 'Moçambique',
    slug: 'mocambique',
    flagCode: 'mz',
    currency: 'MZN',
    isHeadquarters: true,
    description: 'Sede da ABN – AfroBiz Network'
  },
  {
    name: 'Angola',
    slug: 'angola',
    flagCode: 'ao',
    currency: 'AOA',
    description: 'Representação Nacional em Angola'
  },
  {
    name: 'Guiné-Bissau',
    slug: 'guinebissau',
    flagCode: 'gw',
    currency: 'XOF',
    description: 'Representação Nacional na Guiné-Bissau'
  },
  {
    name: 'São Tomé e Príncipe',
    slug: 'saotome',
    flagCode: 'st',
    currency: 'STN',
    description: 'Representação Nacional em São Tomé e Príncipe'
  },
  {
    name: 'Cabo Verde',
    slug: 'caboverde',
    flagCode: 'cv',
    currency: 'CVE',
    description: 'Representação Nacional em Cabo Verde'
  }
];

export default function RepresentacoesPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.container}>
        <div className={styles.header}>
          <h1>Representações Nacionais</h1>
          <p>A ABN – AfroBiz Network está presente em 5 países africanos, conectando empreendedores e impulsionando o ecossistema de negócios lusófono.</p>
        </div>

        <div className={styles.countriesGrid}>
          {countries.map((country) => (
            <Link 
              key={country.slug} 
              href={`/country/${country.slug}`} 
              className={styles.countryCard}
            >
              <div className={styles.countryFlag}>
                <span className={`fi fi-${country.flagCode}`}></span>
              </div>
              <div className={styles.countryName}>{country.name}</div>
              <div className={styles.countryCurrency}>{country.currency}</div>
              {country.isHeadquarters && (
                <div className={styles.badge}>Sede</div>
              )}
              <div className={styles.countryDescription}>{country.description}</div>
              <div className={styles.cta}>Ver Representação </div>
            </Link>
          ))}
        </div>

        <div className={styles.contactSection}>
          <h2>Torne-se Representante</h2>
          <p>Interessado em trazer a ABN para o seu país? Entre em contacto connosco para discutir oportunidades de parceria.</p>
          <Link href="/representacoes/torne-se-representante" className={styles.btn}>
            Candidatar-se como Representante
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}