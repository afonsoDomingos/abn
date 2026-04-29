import { useLanguage } from '@/lib/LanguageContext';

interface Service {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  status: string;
}

export default function Services() {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.services) {
          setServices(data.services.filter((s: any) => s.status === 'ativo').slice(0, 3));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || services.length === 0) return null;

  return (
    <section className={styles.section} id="marketplace">
      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className={styles.badge}>{t.services.badge}</span>
          <h2 className={styles.title}>{t.services.title}</h2>
          <p className={styles.subtitle}>{t.services.subtitle}</p>
        </motion.div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <motion.div 
              key={service._id}
              className={`${styles.card} glass`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.category}>{service.category}</span>
                <div className={styles.dot}></div>
              </div>
              <h3 className={styles.serviceName}>{service.name}</h3>
              <p className={styles.description}>{service.description}</p>
              <div className={styles.footer}>
                <span className={styles.price}>{service.price}</span>
                <button className={styles.btn}>{t.services.request}</button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className={styles.more}>
          <button className="btn-outline">{t.services.viewAll}</button>
        </div>
      </div>
    </section>
  );
}
