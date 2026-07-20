// Lightweight public liveness probe. Intentionally returns NO environment,
// runtime, or host details — only that the server is up (used by CI + uptime
// checks, which just need a 200).
export function GET() {
  return new Response(JSON.stringify({ ok: true, time: new Date().toISOString() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
