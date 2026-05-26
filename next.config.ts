import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/**': [
      // Prisma — not traced by default
      './node_modules/.prisma/client/**',
      './node_modules/@prisma/client/**',
      // Next.js App Router runtime externals — @vercel/nft on Node.js <22 can miss these
      './node_modules/next/dist/server/app-render/*.external.js',
      './node_modules/next/dist/server/app-render/async-local-storage.js',
      './node_modules/next/dist/server/app-render/cache-signal.js',
      './node_modules/next/dist/server/app-render/module-loading/**/*.js',
      './node_modules/next/dist/server/lib/cache-handlers/*.external.js',
      './node_modules/next/dist/server/lib/incremental-cache/*.external.js',
      './node_modules/next/dist/server/load-manifest.external.js',
      './node_modules/next/dist/server/lib/router-utils/instrumentation-globals.external.js',
      './node_modules/next/dist/server/lib/router-utils/instrumentation-node-extensions.js',
      './node_modules/next/dist/server/lib/trace/constants.js',
      './node_modules/next/dist/server/lib/trace/tracer.js',
      './node_modules/next/dist/server/lib/lru-cache.js',
      './node_modules/next/dist/server/response-cache/types.js',
      './node_modules/next/dist/client/components/app-router-headers.js',
      './node_modules/next/dist/compiled/jsonwebtoken/**',
      './node_modules/next/dist/compiled/@opentelemetry/**',
      './node_modules/next/dist/shared/lib/deep-freeze.js',
      './node_modules/next/dist/shared/lib/invariant-error.js',
      './node_modules/next/dist/shared/lib/is-plain-object.js',
      './node_modules/next/dist/shared/lib/is-thenable.js',
      './node_modules/next/dist/shared/lib/no-fallback-error.external.js',
      './node_modules/next/dist/shared/lib/page-path/ensure-leading-slash.js',
      './node_modules/next/dist/shared/lib/router/utils/app-paths.js',
      './node_modules/next/dist/shared/lib/segment.js',
      './node_modules/next/dist/shared/lib/server-reference-info.js',
      './node_modules/next/dist/lib/client-and-server-references.js',
      './node_modules/next/dist/lib/constants.js',
      './node_modules/next/dist/lib/interop-default.js',
      './node_modules/next/dist/lib/is-error.js',
      './node_modules/next/dist/lib/semver-noop.js',
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3001',
        'sustainplus-ai-crh0bqhffyewhxa5.westeurope-01.azurewebsites.net',
      ],
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
