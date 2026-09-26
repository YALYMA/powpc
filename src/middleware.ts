import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'powerpc_session';

async function readSession(token?: string) {
  if (!token || !process.env.AUTH_SECRET) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    return payload as { userId: string; role: 'USER' | 'ADMIN' };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith('/admin')) {
    if (!session) {
      const url = new URL('/connexion', request.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    if (session.role !== 'ADMIN') return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/compte') && !session) {
    const url = new URL('/connexion', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/compte/:path*']
};
