import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    '/**': [
      './node_modules/.prisma/client/**',
      './node_modules/@prisma/client/**',
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
