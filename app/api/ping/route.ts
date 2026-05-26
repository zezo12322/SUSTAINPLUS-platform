export function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      time: new Date().toISOString(),
      node: process.version,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        AUTH_SECRET: process.env.AUTH_SECRET ? 'SET' : 'MISSING',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
        PORT: process.env.PORT || 'MISSING',
        HOSTNAME: process.env.HOSTNAME || 'MISSING',
      },
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
