import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Auth checks are handled in individual page/layout server components via auth()
// Middleware is kept minimal to avoid Edge Runtime incompatibilities
export function middleware(_req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)'],
}
