import { NextResponse } from 'next/server';

export function middleware(request) {
  const user = request.cookies.get('user');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/registro');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // Redirecionar para login se não estiver autenticado
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    if (user) {
      const userData = JSON.parse(user.value);

      // Proteger rota de admin
      if (isAdminPage && !userData.isAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Redirecionar de páginas de auth quando logado
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  } catch (error) {
    // Limpar cookie e redirecionar para login em caso de erro
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('user');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 