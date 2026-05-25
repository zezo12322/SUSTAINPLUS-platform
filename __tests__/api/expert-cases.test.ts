import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/auth', () => ({ auth: vi.fn() }))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    expertCase: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    notification: { create: vi.fn() },
    auditLog: { create: vi.fn() },
  },
}))

import { GET, POST } from '@/app/api/expert-cases/route'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const mockSession = {
  user: { id: 'user-1', email: 'test@sustainplus.com' },
  expires: '2099-01-01',
}

function makePostRequest(body: object) {
  return new NextRequest('http://localhost:3001/api/expert-cases', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

const validBody = {
  sessionId: 'session-abc',
  descriptionAr: 'وصف كافٍ للمشكلة البيئية المطروحة للنظر',
  priority: 'normal',
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/expert-cases', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as any)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns 200 with cases array when authenticated', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    vi.mocked(prisma.expertCase.findMany).mockResolvedValueOnce([
      { id: 'case-1', status: 'PENDING', priority: 'normal', descriptionAr: 'وصف' },
      { id: 'case-2', status: 'IN_REVIEW', priority: 'high', descriptionAr: 'وصف' },
    ] as any)

    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.cases)).toBe(true)
    expect(body.cases).toHaveLength(2)
  })

  it('returns empty array when user has no cases', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    vi.mocked(prisma.expertCase.findMany).mockResolvedValueOnce([])

    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.cases).toHaveLength(0)
  })
})

describe('POST /api/expert-cases', () => {
  it('returns 401 when unauthenticated', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as any)
    const res = await POST(makePostRequest(validBody))
    expect(res.status).toBe(401)
  })

  it('returns 400 when descriptionAr is too short (< 10 chars)', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    const res = await POST(makePostRequest({ ...validBody, descriptionAr: 'قصير' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when descriptionAr exceeds 5000 chars', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    const res = await POST(makePostRequest({ ...validBody, descriptionAr: 'أ'.repeat(5001) }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid priority value', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    const res = await POST(makePostRequest({ ...validBody, priority: 'critical' }))
    expect(res.status).toBe(400)
  })

  it('returns 200 with existing caseId when case already exists for same session', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    vi.mocked(prisma.expertCase.findUnique).mockResolvedValueOnce({
      id: 'existing-case-id',
    } as any)

    const res = await POST(makePostRequest(validBody))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.caseId).toBe('existing-case-id')
  })

  it('returns 201 and creates case with notification and audit log', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    vi.mocked(prisma.expertCase.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.expertCase.create).mockResolvedValueOnce({ id: 'new-case-123' } as any)
    vi.mocked(prisma.notification.create).mockResolvedValueOnce({} as any)
    vi.mocked(prisma.auditLog.create).mockResolvedValueOnce({} as any)

    const res = await POST(makePostRequest(validBody))
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.caseId).toBe('new-case-123')
    expect(typeof body.messageAr).toBe('string')
  })

  it('creates notification and audit log on new case', async () => {
    vi.mocked(auth).mockResolvedValueOnce(mockSession as any)
    vi.mocked(prisma.expertCase.findUnique).mockResolvedValueOnce(null)
    vi.mocked(prisma.expertCase.create).mockResolvedValueOnce({ id: 'case-xyz' } as any)
    vi.mocked(prisma.notification.create).mockResolvedValueOnce({} as any)
    vi.mocked(prisma.auditLog.create).mockResolvedValueOnce({} as any)

    await POST(makePostRequest({ ...validBody, priority: 'high' }))

    expect(prisma.notification.create).toHaveBeenCalledOnce()
    expect(prisma.auditLog.create).toHaveBeenCalledOnce()
  })
})
