/* eslint-disable */
// Diagnostic endpoint — Pages Router (bypasses App Router runtime entirely)
function safe(fn) {
  try { fn(); return 'ok' } catch (e) { return String(e.message).slice(0, 300) }
}

module.exports = function handler(req, res) {
  const modules = {}
  const toCheck = [
    'next/dist/server/app-render/work-async-storage.external.js',
    'next/dist/server/app-render/action-async-storage.external.js',
    'next/dist/server/load-manifest.external.js',
    'next/dist/server/lib/trace/tracer',
    'next/dist/compiled/jsonwebtoken',
    'next/dist/compiled/@opentelemetry/api',
    '@prisma/client',
    'bcryptjs',
  ]
  for (const mod of toCheck) {
    modules[mod] = safe(() => require(mod))
  }

  res.json({
    ok: true,
    runtime: 'pages-router',
    node: process.version,
    platform: process.platform,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      AUTH_SECRET: process.env.AUTH_SECRET ? 'SET' : 'MISSING',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
      PORT: process.env.PORT || 'MISSING',
    },
    modules,
    cwd: process.cwd(),
  })
}
