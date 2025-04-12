import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  
  const publicPaths = ['/auth/login', '/auth/register'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  let isAuthenticated = false;
  try {
    const token = (await cookies()).get('auth_token')?.value;
    
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET!);
      isAuthenticated = true;
    }
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    isAuthenticated = false;
  }

  if (pathname.startsWith('/app') && !isAuthenticated) {
    const redirectUrl = new URL('/auth/login', origin);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith('/auth') && isAuthenticated) {
    return NextResponse.redirect(new URL('/app', origin));
  }

  if (pathname.startsWith('/api/secure') && !isAuthenticated) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/app/:path*',
    '/auth/:path*',
    '/api/secure/:path*'
  ]
};