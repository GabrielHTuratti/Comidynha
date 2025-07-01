import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import {jwtVerify} from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  
  const publicPaths = ['/auth'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  try {

    const acessToken = (await cookies()).get('auth_token')?.value;
    if (acessToken) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(acessToken, secret);
      return NextResponse.next();
    }

    const refreshToken = (await cookies()).get('rfs_token')?.value;
    if(refreshToken){
      const secret = new TextEncoder().encode(process.env.REFRESH_TOKEN);
      const {payload} = await jwtVerify(refreshToken, secret);
      if(!payload.tokenVersion || !payload.userId){
        throw new Error("Token inválido");
      }
      if (pathname.startsWith('/main') || pathname.startsWith('/api')) {
        const redirectUrl = NextResponse.redirect(new URL('/api/auth/refresh', origin))
        redirectUrl.cookies.set('redirect_url', pathname);
        return redirectUrl;
      }

      return NextResponse.next();
    }
    throw new Error("Não autenticado");
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    if (pathname.startsWith('/api/refeicao')) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );

    }
    if (pathname.startsWith('/main')) {
      const redirectUrl = new URL('/auth/customer', origin);
      redirectUrl.searchParams.set('redirect', pathname);

      const response = NextResponse.redirect(redirectUrl);
      response.cookies.delete('auth_token')
      response.cookies.delete('rfs_token');

      return response;
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/main/:path*',
    '/auth/:path*',
    '/api/:path*'
  ]
};