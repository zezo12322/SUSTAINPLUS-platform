process.on('uncaughtException', (err) => {
  console.error('[STARTUP] uncaughtException:', err.message, err.stack)
  // Don't exit — Next.js throws non-fatal errors internally
})
process.on('unhandledRejection', (reason) => {
  console.error('[STARTUP] unhandledRejection:', reason)
  // Don't exit — Next.js has internal unhandled rejections for route modules
})

console.log('[STARTUP] node version:', process.version)
console.log('[STARTUP] cwd:', process.cwd())
console.log('[STARTUP] PORT:', process.env.PORT || '(not set)')
console.log('[STARTUP] NODE_ENV:', process.env.NODE_ENV || '(not set)')
console.log('[STARTUP] DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'MISSING')
console.log('[STARTUP] NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING')
console.log('[STARTUP] AUTH_SECRET:', process.env.AUTH_SECRET ? 'SET' : 'MISSING')
console.log('[STARTUP] GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'MISSING')
console.log('[STARTUP] NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'MISSING')

// Test Prisma binary
try {
  const { PrismaClient } = require('@prisma/client')
  const client = new PrismaClient()
  console.log('[STARTUP] Prisma client created OK')
  client.$disconnect().catch(() => {})
} catch (err) {
  console.error('[STARTUP] Prisma init ERROR:', err.message)
}

require('./server.js')
