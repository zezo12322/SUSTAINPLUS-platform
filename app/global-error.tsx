'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#f9fafb' }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <p style={{ fontSize: '4rem', fontWeight: 'bold', color: '#9ca3af', marginBottom: '1rem' }}>!</p>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
              حدث خطأ في تحميل الصفحة
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              {process.env.NODE_ENV !== 'production' ? error.message : 'يرجى إعادة المحاولة.'}
            </p>
            <button
              onClick={reset}
              style={{
                background: '#1e6b3f',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              حاول مرة أخرى
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
