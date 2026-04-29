import { useLanguage } from '@/lib/LanguageContext';
import Counter from './Counter';

export default function Stats() {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState([
    { label: '', value: '150+' },
    { label: '', value: '$2.5M' },
    { label: '', value: '45' },
    { label: '', value: '12' }
  ]);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.configs && data.configs.stats_content) {
          setStats(data.configs.stats_content);
        }
      });
  }, []);

  const getLabel = (index: number, defaultLabel: string) => {
    if (language !== 'pt') {
      const keys = ['s1', 's2', 's3', 's4'];
      return (t.stats as any)[keys[index]] || defaultLabel;
    }
    return defaultLabel || (t.stats as any)[['s1', 's2', 's3', 's4'][index]];
  };

  return (
    <section className={styles.statsSection} id="impacto">
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              className={styles.statItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className={styles.value}>
                {stat.value.startsWith('$') ? '$' : ''}
                <Counter value={stat.value.replace('$', '')} />
              </div>
              <div className={styles.label}>{getLabel(i, stat.label)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
