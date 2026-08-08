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
  const isStaticAsset = /\.(png|jpe?g|gif|svg|webp|ico|css|js|txt|woff2?|map)$/i.test(nextUrl.pathname)
  // Public marketing routes (EN at root, AR under /ar).
  const marketingRoutes = ['/about', '/services', '/case-studies', '/insights', '/contact']
  const p = nextUrl.pathname
  const isMarketing =
    p === '/' ||
    p === '/ar' ||
    marketingRoutes.some(
      (r) => p === r || p.startsWith(r + '/') || p === '/ar' + r || p.startsWith('/ar' + r + '/'),
    )

  const isPublic = isMarketing ||
    nextUrl.pathname.startsWith('/platform') ||
    nextUrl.pathname.startsWith('/pricing') ||
    nextUrl.pathname.startsWith('/trust') ||
    nextUrl.pathname.startsWith('/privacy-policy') ||
    nextUrl.pathname.startsWith('/terms') ||
    nextUrl.pathname.startsWith('/refund-policy') ||
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.startsWith('/favicon') ||
    // Payment return pages + Paymob's server-to-server webhook (authenticated by
    // HMAC, not by session — must not be redirected to /login).
    nextUrl.pathname.startsWith('/payment/') ||
    nextUrl.pathname === '/api/payments/webhook' ||
    nextUrl.pathname === '/api/ping' ||
    nextUrl.pathname === '/api/health'

  if (isPublic || isApiAuth || isStaticAsset) return NextResponse.next()

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
