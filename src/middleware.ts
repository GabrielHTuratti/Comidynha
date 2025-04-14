import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import {jwtVerify} from 'jose';

process.env.JWT_SECRET = "G@BR!3LTUR4TT1D3V3L0P3RJUN10RF1N2NCY4PP";

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  
  const publicPaths = ['/auth'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  let isAuthenticated = false;
  try {
    const token = (await cookies()).get('auth_token')?.value;
    
    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      isAuthenticated = true;
    }
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    isAuthenticated = false;
  }

  if (pathname.startsWith('/main') && !isAuthenticated) {
    const redirectUrl = new URL('/auth/customer', origin);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith('/auth') && isAuthenticated) {
    return NextResponse.redirect(new URL('/main', origin));
  }

  if (pathname.startsWith('/api/refeicao') && !isAuthenticated) {
    return NextResponse.json(
      { error: 'Não autorizado' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/main/:path*',
    '/auth/:path*',
    '/api/:path*'
  ]
};