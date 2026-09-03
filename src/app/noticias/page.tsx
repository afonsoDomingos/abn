import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import Config from '@/models/Config';
import NoticiasClient from './NoticiasClient';
import styles from './NoticiasPublic.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Notícias, Artigos e Blog - ABN',
  description: 'Fique por dentro das últimas notícias, blog, comunicados de imprensa e histórias de sucesso de empreendedores da rede Afrobiz Network.',
};

export default async function PublicNoticiasPage() {
  await dbConnect();
  
  const bannerConfig = await Config.findOne({ key: 'page_banners' }).lean();
  const bannerUrl = bannerConfig?.value?.noticias || '';

  const rawPosts = await Post.find({ section: 'news' }).sort({ date: -1, createdAt: -1 }).lean();

  const serializedPosts = rawPosts.map((p: any) => ({
    _id: p._id.toString(),
    title: p.title,
    content: p.content,
    section: p.section,
    type: p.type,
    date: p.date,
    location: p.location || '',
    imageUrl: p.imageUrl || '',
    views: p.views || 0,
    comments: (p.comments || []).map((c: any) => ({
      name: c.name,
      text: c.text,
      date: c.date ? c.date.toISOString() : new Date().toISOString()
    }))
  }));

  return (
    <main className={styles.noticiasPage}>
      <Navbar />

      <header className={styles.hero} style={{ backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(10, 10, 10, 0.95) 100%), url('${bannerUrl}')` }}>
        <div className={styles.container}>
          <h1 className="text-gradient-gold">ABN Notícias & Mídia</h1>
          <p>
            Acompanhe o pulso do empreendedorismo em África: comunicados oficiais, histórias de sucesso inspiradoras, artigos de fundo e blog.
          </p>
        </div>
      </header>

      <section style={{ paddingBottom: '4rem' }}>
        <div className={styles.container}>
          <NoticiasClient initialPosts={serializedPosts} />
        </div>
      </section>
    </main>
  );
}
