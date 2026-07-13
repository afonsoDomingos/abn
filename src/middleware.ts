import { NextRequest, NextResponse } from 'next/server';

// Rotas que requerem autenticação
const protectedRoutes = ['/dashboard', '/admin', '/api/admin', '/api/user/profile'];

// Rotas do admin que requerem role "admin"
const adminRoutes = ['/admin', '/api/admin'];

// Rotas de autenticação (redireciona para dashboard se já logado)
const authRoutes = ['/login', '/registro'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ler o cookie de sessão
  const sessionCookie = request.cookies.get('abn_session');
  let session: { id: string; name: string; email: string; role: string } | null = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      session = null;
    }
  }

  const isAuthenticated = !!session;
  const isAdmin = session?.role === 'admin';

  // Se já está logado e tenta aceder às páginas de auth, redireciona
  if (authRoutes.some(r => pathname.startsWith(r))) {
    if (isAuthenticated) {
      const redirectTo = isAdmin ? '/admin' : '/dashboard';
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    return NextResponse.next();
  }

  // Verificar se a rota requer autenticação
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r));
  if (!isProtected) return NextResponse.next();

  const isApiRoute = pathname.startsWith('/api/');

  // Não está autenticado
  if (!isAuthenticated) {
    if (isApiRoute) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Sessão expirada ou não autenticado.' }), {
        status: 401,
        headers: { 'content-type': 'application/json' }
      });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rota de admin — verifica se tem role admin
  const isAdminRoute = adminRoutes.some(r => pathname.startsWith(r));
  if (isAdminRoute && !isAdmin) {
    if (isApiRoute) {
      return new NextResponse(JSON.stringify({ success: false, error: 'Acesso negado. Apenas administradores.' }), {
        status: 403,
        headers: { 'content-type': 'application/json' }
      });
    }
    // Utilizador logado mas sem permissão de admin → redireciona para dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/user/profile',
    '/login',
    '/registro',
  ],
};
