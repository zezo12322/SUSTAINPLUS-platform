import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '@/auth.config'

const { auth } = NextAuth(authConfig)

export default auth(function middleware(req) {
  const { nextUrl, auth: session } = req as any
  const isLoggedIn = !!session?.user
  const emailVerified = session?.user?.emailVerified ?? false

  const isAuthRoute = nextUrl.pathname.startsWith('/login') ||
    nextUrl.pathname.startsWith('/register') ||
    nextUrl.pathname.startsWith('/verify-email') ||
    nextUrl.pathname.startsWith('/forgot-password') ||
    nextUrl.pathname.startsWith('/reset-password')

  const isApiAuth = nextUrl.pathname.startsWith('/api/auth')
  const isPublic = nextUrl.pathname === '/' ||
    nextUrl.pathname.startsWith('/pricing') ||
    nextUrl.pathname.startsWith('/trust') ||
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.startsWith('/favicon') ||
    nextUrl.pathname === '/api/ping' ||
    nextUrl.pathname === '/api/health' ||
    nextUrl.pathname === '/api/env'

  if (isPublic || isApiAuth) return NextResponse.next()

  // Not logged in → redirect to login
  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL(`/login?redirect=${nextUrl.pathname}`, req.url))
  }

  // Logged in but email not verified → redirect to verify-email
  if (isLoggedIn && !emailVerified && !isAuthRoute) {
    return NextResponse.redirect(new URL('/verify-email', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)'],
}
