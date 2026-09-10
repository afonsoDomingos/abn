import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import UniversityProfile from '@/models/UniversityProfile';

export const dynamic = 'force-dynamic';

// Universidades e Academias curadas da Rede ABN
const CURATED_UNIVERSITIES = [
  {
    _id: 'uni-ambu',
    universityName: 'Universidade Amílcar Cabral (UAC)',
    universityType: 'publica',
    country: 'Guiné-Bissau',
    city: 'Bissau',
    logo: '🎓',
    headline: 'A principal instituição de ensino superior de Guiné-Bissau, formando líderes para o século XXI',
    researchAreas: ['Direito', 'Engenharia', 'Economia', 'Ciências Políticas'],
    programs: 12,
    students: 4200,
    researchProjects: 8,
    website: 'https://uac.gw'
  },
  {
    _id: 'uni-uem',
    universityName: 'Universidade Eduardo Mondlane (UEM)',
    universityType: 'publica',
    country: 'Moçambique',
    city: 'Maputo',
    logo: '🎓',
    headline: 'Maior universidade de Moçambique, hub de inovação e investigação científica aplicada',
    researchAreas: ['Agro', 'Engenharia Civil', 'Medicina', 'Tecnologia', 'Economia'],
    programs: 45,
    students: 22000,
    researchProjects: 34,
    website: 'https://uem.mz'
  },
  {
    _id: 'uni-agostinho',
    universityName: 'Universidade Agostinho Neto (UAN)',
    universityType: 'publica',
    country: 'Angola',
    city: 'Luanda',
    logo: '🎓',
    headline: 'Polo de investigação e empreendedorismo para a diversificação económica de Angola',
    researchAreas: ['Petróleo & Gás', 'Gestão', 'Direito', 'Saúde', 'Tecnologia'],
    programs: 38,
    students: 19500,
    researchProjects: 21,
    website: 'https://uan.ao'
  }
];

export async function GET(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');

    let sessionUser: any = null;
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
        const uid = parsed.id || parsed._id;
        if (uid) sessionUser = await User.findById(uid).lean();
      } catch (e) {}
    }

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'dashboard';

    // Vista de busca de universidades (para Startups/Empresas procurarem)
    if (view === 'directory') {
      const dbUniversities = await UniversityProfile.find({ 'metrics.totalStudents': { $gte: 0 } })
        .limit(20).lean();
      return NextResponse.json({
        success: true,
        universities: dbUniversities.length > 0 ? dbUniversities : CURATED_UNIVERSITIES,
        curatedUniversities: CURATED_UNIVERSITIES
      });
    }

    // Dashboard da Universidade (utilizador logado)
    let uniProfile = sessionUser
      ? await UniversityProfile.findOne({ userId: sessionUser._id }).lean()
      : null;

    // Gerar perfil enriquecido de demonstração se não existir
    if (!uniProfile) {
      uniProfile = {
        userId: sessionUser?._id,
        universityName: sessionUser?.company || 'Universidade Politécnica da Lusofonia (UPL)',
        universityType: 'publica',
        country: sessionUser?.country || 'Guiné-Bissau',
        city: sessionUser?.city || 'Bissau',
        website: sessionUser?.website || 'https://upl-lusofonia.edu.gw',
        institutionalBio: 'Instituição de ensino superior comprometida com a formação de líderes inovadores e a produção de conhecimento científico aplicado para o desenvolvimento sustentável.',
        headline: 'Polo de Ciência, Inovação e Empreendedorismo para o Desenvolvimento Lusófono',
        foundedYear: '2008',
        accreditations: ['ANEQ', 'ISO 9001:2015 Qualidade Educacional'],
        researchAreas: ['Inteligência Artificial', 'Agroecologia', 'Energia Renovável', 'Gestão de Negócios', 'Saúde Pública'],
        programs: [
          {
            title: 'Licenciatura em Gestão e Empreendedorismo',
            level: 'licenciatura',
            area: 'Negócios & Empreendedorismo',
            duration: '4 anos',
            mode: 'presencial',
            enrollmentOpen: true,
            applicationLink: 'https://upl-lusofonia.edu.gw/candidaturas',
            description: 'Forma gestores com visão empreendedora para liderar organizações em contextos de alta incerteza e mudança tecnológica.'
          },
          {
            title: 'Mestrado em Inovação e Tecnologia Digital',
            level: 'mestrado',
            area: 'Tecnologia & Inovação',
            duration: '2 anos',
            mode: 'hibrido',
            enrollmentOpen: true,
            applicationLink: 'https://upl-lusofonia.edu.gw/mestrado',
            description: 'Programa de pós-graduação em parceria com empresas tecnológicas para formar especialistas em transformação digital.'
          },
          {
            title: 'MBA Executivo em Liderança Estratégica',
            level: 'formacao_executiva',
            area: 'Liderança & Estratégia',
            duration: '18 meses',
            mode: 'online',
            enrollmentOpen: false,
            applicationLink: 'https://upl-lusofonia.edu.gw/mba',
            description: 'Programa executivo para líderes organizacionais que desejam aprofundar competências de liderança e estratégia.'
          }
        ],
        researchProjects: [
          {
            title: 'IA para Diagnóstico Precoce de Doenças Tropicais',
            area: 'Saúde Pública & Tecnologia',
            description: 'Desenvolvimento de modelos de machine learning para identificação precoce de malária, dengue e outras doenças tropicais em contextos de recursos limitados.',
            status: 'em_andamento',
            leadResearcher: 'Prof. Dra. Mariana Vieira',
            fundingSource: 'PNUD & Fundação Bill Gates',
            publicationUrl: '',
            year: '2026'
          },
          {
            title: 'Agricultura de Precisão com Sensores IoT para PMEs Agrícolas',
            area: 'Agroecologia & IoT',
            description: 'Sistema de monitoramento de solo e clima para otimização de culturas em pequenas e médias propriedades da África Subsaariana.',
            status: 'em_andamento',
            leadResearcher: 'Prof. Carlos Mané',
            fundingSource: 'AfDB Innovation Fund',
            publicationUrl: 'https://doi.org/10.1234/agroiot-2025',
            year: '2025'
          },
          {
            title: 'Estudo Comparativo de Ecossistemas de Inovação Lusófonos',
            area: 'Gestão da Inovação',
            description: 'Análise comparativa dos ecossistemas empreendedores de Guiné-Bissau, Moçambique, Angola e Cabo Verde.',
            status: 'publicado',
            leadResearcher: 'Prof. Luís Mendonça',
            fundingSource: 'CPLP & EU Horizon',
            publicationUrl: 'https://doi.org/10.1234/ecosistemas-2024',
            year: '2024'
          }
        ],
        internships: [
          {
            title: 'Estágio em Transformação Digital — Laboratório de IA',
            department: 'Departamento de Informática',
            area: 'Tecnologia & Inovação',
            duration: '6 meses',
            description: 'Oportunidade para estudantes de informática e gestão participarem em projetos reais de desenvolvimento de soluções com IA para PMEs locais.',
            requirements: ['Curso de Informática ou Gestão (3.º ano+)', 'Noções de Python ou JavaScript', 'Inglês Básico'],
            applicationDeadline: '2026-11-30',
            status: 'aberto',
            slots: 12
          },
          {
            title: 'Estágio em Pesquisa Agroecológica — Parceria EMBRAPA',
            department: 'Departamento de Ciências Agrárias',
            area: 'Agricultura & Sustentabilidade',
            duration: '4 meses',
            description: 'Estágio prático em campo e laboratório para análise de solo e implementação de tecnologias sustentáveis de irrigação.',
            requirements: ['Curso de Agronomia ou Biologia', 'Disponibilidade para deslocações', 'Carta de motivação'],
            applicationDeadline: '2026-10-15',
            status: 'aberto',
            slots: 8
          }
        ],
        innovationChallenges: [
          {
            title: 'Hackathon UPL × ABN 2026: Soluções FinTech para Inclusão Financeira',
            description: 'Desafio de 48h para equipas multidisciplinares desenvolverem protótipos de soluções fintech para bancarizar populações rurais e comerciantes informais.',
            prize: '5.000 € + Pré-Aceleração ABN + Pitch para Investidores',
            theme: 'FinTech & Inclusão Financeira',
            deadline: '2026-12-10',
            status: 'aberto',
            applicantsCount: 87
          },
          {
            title: 'Desafio de Inovação Social: Soluções para ODS 2 & 3',
            description: 'Competição académica para estudantes e startups apresentarem soluções inovadoras para erradicar a fome e promover saúde nos PALOP.',
            prize: '3.000 € + Publicação Académica + Mentoria Internacional',
            theme: 'Inovação Social & ODS',
            deadline: '2026-11-20',
            status: 'aberto',
            applicantsCount: 52
          }
        ],
        connectedStartups: [
          { name: 'AgroMoz Smart', sector: 'Agro-Tech', year: '2024', type: 'spin_off' },
          { name: 'MedScan Africa', sector: 'HealthTech', year: '2023', type: 'spin_off' },
          { name: 'EduVerse GB', sector: 'EdTech', year: '2025', type: 'incubada' },
          { name: 'CleanEnergy Lusofona', sector: 'CleanTech', year: '2024', type: 'alumni' }
        ],
        events: [
          {
            title: 'Conferência Internacional de Inovação e Empreendedorismo (CIIE 2026)',
            date: '2026-11-14',
            type: 'Conferência Internacional',
            location: 'Campus UPL & Transmissão Online ABN',
            description: 'Maior conferência lusófona de inovação com speakers internacionais, painéis temáticos e feira de startups.',
            registrationLink: 'https://ciie2026.upl-lusofonia.edu.gw',
            status: 'aberto'
          },
          {
            title: 'Simpósio de I&D: Ciência para o Desenvolvimento Sustentável',
            date: '2026-10-08',
            type: 'Simpósio Científico',
            location: 'Auditório Central UPL',
            description: 'Apresentação de resultados de projetos de investigação em andamento e publicações recentes dos centros de investigação.',
            registrationLink: 'https://upl-lusofonia.edu.gw/simposio',
            status: 'aberto'
          }
        ],
        metrics: {
          totalStudents: 8500,
          totalResearchers: 142,
          totalPublications: 87,
          totalSpinOffs: 14,
          totalInternshipsOffered: 120,
          rankingPosition: 'Top 3 Guiné-Bissau'
        }
      };
    }

    // Startups e empreendedores à procura de parcerias académicas
    const ecossystemSummary = {
      startupsLookingForPartners: 24,
      companiesOffering: 18,
      openInternshipRequests: 9,
      innovationChallengesActive: 6
    };

    return NextResponse.json({
      success: true,
      universityProfile: uniProfile,
      ecossystemSummary,
      curatedUniversities: CURATED_UNIVERSITIES
    });

  } catch (error: any) {
    console.error('Error in GET /api/university:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('abn_session');

    let sessionUser: any = null;
    if (sessionCookie) {
      try {
        const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
        const uid = parsed.id || parsed._id;
        if (uid) sessionUser = await User.findById(uid);
      } catch (e) {}
    }

    if (!sessionUser) {
      return NextResponse.json({ success: false, message: 'Autenticação necessária.' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    let uniProfile = await UniversityProfile.findOne({ userId: sessionUser._id });

    // Criar perfil se não existir
    if (!uniProfile && action !== 'init') {
      uniProfile = await UniversityProfile.create({
        userId: sessionUser._id,
        universityName: sessionUser.company || 'Universidade ABN',
        country: sessionUser.country || '',
        city: sessionUser.city || ''
      });
    }

    // 1. Atualizar Perfil Institucional
    if (action === 'update_profile') {
      const { universityName, headline, universityType, country, city, website, institutionalBio, foundedYear, researchAreas, accreditations } = body;
      if (!uniProfile) return NextResponse.json({ success: false, message: 'Perfil não encontrado' }, { status: 404 });

      if (universityName) uniProfile.universityName = universityName;
      if (headline) uniProfile.headline = headline;
      if (universityType) uniProfile.universityType = universityType;
      if (country) uniProfile.country = country;
      if (city) uniProfile.city = city;
      if (website) uniProfile.website = website;
      if (institutionalBio) uniProfile.institutionalBio = institutionalBio;
      if (foundedYear) uniProfile.foundedYear = foundedYear;
      if (researchAreas) uniProfile.researchAreas = researchAreas;
      if (accreditations) uniProfile.accreditations = accreditations;
      uniProfile.updatedAt = new Date();
      await uniProfile.save();

      return NextResponse.json({ success: true, message: 'Perfil institucional atualizado com sucesso.' });
    }

    // 2. Publicar Programa
    if (action === 'add_program') {
      const { title, level, area, duration, mode, enrollmentOpen, applicationLink, description } = body;
      if (!title) return NextResponse.json({ success: false, message: 'Título do programa é obrigatório.' }, { status: 400 });

      uniProfile.programs.push({ title, level: level || 'licenciatura', area: area || '', duration: duration || '', mode: mode || 'presencial', enrollmentOpen: enrollmentOpen !== false, applicationLink: applicationLink || '', description: description || '' });
      await uniProfile.save();
      return NextResponse.json({ success: true, message: 'Programa publicado com sucesso.' });
    }

    // 3. Publicar Investigação
    if (action === 'add_research') {
      const { title, area, description, status, leadResearcher, fundingSource, publicationUrl, year } = body;
      if (!title) return NextResponse.json({ success: false, message: 'Título do projeto é obrigatório.' }, { status: 400 });

      uniProfile.researchProjects.push({ title, area: area || '', description: description || '', status: status || 'em_andamento', leadResearcher: leadResearcher || '', fundingSource: fundingSource || '', publicationUrl: publicationUrl || '', year: year || new Date().getFullYear().toString() });
      await uniProfile.save();
      return NextResponse.json({ success: true, message: 'Projeto de investigação publicado com sucesso.' });
    }

    // 4. Publicar Oportunidade de Estágio
    if (action === 'add_internship') {
      const { title, department, area, duration, description, requirements, applicationDeadline, slots } = body;
      if (!title) return NextResponse.json({ success: false, message: 'Título da oportunidade é obrigatório.' }, { status: 400 });

      uniProfile.internships.push({ title, department: department || '', area: area || '', duration: duration || '', description: description || '', requirements: Array.isArray(requirements) ? requirements : (requirements ? [requirements] : []), applicationDeadline: applicationDeadline || '', status: 'aberto', slots: slots || 5 });
      if (!uniProfile.metrics) uniProfile.metrics = {};
      uniProfile.metrics.totalInternshipsOffered = (uniProfile.metrics.totalInternshipsOffered || 0) + 1;
      await uniProfile.save();
      return NextResponse.json({ success: true, message: 'Oportunidade de estágio publicada com sucesso.' });
    }

    // 5. Criar Desafio de Inovação
    if (action === 'add_challenge') {
      const { title, description, prize, theme, deadline } = body;
      if (!title) return NextResponse.json({ success: false, message: 'Título do desafio é obrigatório.' }, { status: 400 });

      uniProfile.innovationChallenges.push({ title, description: description || '', prize: prize || '', theme: theme || '', deadline: deadline || '', status: 'aberto', applicantsCount: 0 });
      await uniProfile.save();
      return NextResponse.json({ success: true, message: 'Desafio de inovação lançado com sucesso.' });
    }

    // 6. Publicar Evento
    if (action === 'add_event') {
      const { title, date, type, location, description, registrationLink } = body;
      if (!title) return NextResponse.json({ success: false, message: 'Título do evento é obrigatório.' }, { status: 400 });

      uniProfile.events.push({ title, date: date || '', type: type || 'Conferência / Seminário', location: location || 'Campus Universitário', description: description || '', registrationLink: registrationLink || '', status: 'aberto' });
      await uniProfile.save();
      return NextResponse.json({ success: true, message: 'Evento publicado com sucesso.' });
    }

    return NextResponse.json({ success: false, message: 'Ação não reconhecida.' }, { status: 400 });

  } catch (error: any) {
    console.error('Error in POST /api/university:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
