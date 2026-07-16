import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import GaleriaClient from './GaleriaClient';
import styles from './GaleriaPublic.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Galeria Multimédia - ABN',
  description: 'Explore a galeria de fotografias, vídeos de pitches, episódios de podcasts e publicações informativas da rede Afrobiz Network.',
};

export default async function PublicGaleriaPage() {
  await dbConnect();
  
  const rawItems = await Post.find({ section: 'gallery' }).sort({ date: -1, createdAt: -1 }).lean();

  const serializedItems = rawItems.map((item: any) => ({
    _id: item._id.toString(),
    title: item.title,
    content: item.content,
    section: item.section,
    type: item.type,
    date: item.date,
    location: item.location || '',
    imageUrl: item.imageUrl || '',
    mediaUrl: item.mediaUrl || ''
  }));

  return (
    <main className={styles.galeriaPage}>
      <Navbar />

      <header className={styles.hero}>
        <div className={styles.container}>
          <h1 className="text-gradient-gold">Galeria Multimédia</h1>
          <p>
            Explore o nosso acervo digital: registros fotográficos de eventos, vídeos educativos, episódios do AfroBiz Podcast e manuais informativos.
          </p>
        </div>
      </header>

      <section style={{ paddingBottom: '4rem' }}>
        <div className={styles.container}>
          <GaleriaClient initialItems={serializedItems} />
        </div>
      </section>
    </main>
  );
}
