import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PREFIXES = ['/dashboard', '/admin']
const AUTH_PAGES = ['/login', '/register']
const ADMIN_ONLY = ['/admin']

export default auth(async (req) => {
  const { nextUrl, auth: session } = req
  const path = nextUrl.pathname
  const isLoggedIn = !!session?.user

  // Admin-only routes
  if (ADMIN_ONLY.some((prefix) => path.startsWith(prefix))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login?redirect=' + path, req.url))
    }
    const role = (session?.user as any)?.role
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  // Protected routes — must be logged in
  if (PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login?redirect=' + path, req.url))
    }
    return NextResponse.next()
  }

  // Auth pages — redirect logged-in users to dashboard
  if (AUTH_PAGES.some((p) => path === p) && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images).*)',
  ],
}
