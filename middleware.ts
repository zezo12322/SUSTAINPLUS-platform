import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PREFIXES = ['/dashboard', '/admin']
const AUTH_PAGES = ['/login', '/register']
const ADMIN_ONLY = ['/admin']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  let token: any = null
  try {
    token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'fallback',
    })
  } catch {
    // getToken failed — treat as unauthenticated
  }

  const isLoggedIn = !!token

  if (ADMIN_ONLY.some((prefix) => path.startsWith(prefix))) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login?redirect=' + path, req.url))
    if (token?.role !== 'ADMIN') return NextResponse.redirect(new URL('/dashboard', req.url))
    return NextResponse.next()
  }

  if (PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login?redirect=' + path, req.url))
    return NextResponse.next()
  }

  if (AUTH_PAGES.some((p) => path === p) && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|logo.png|images).*)',
  ],
}
