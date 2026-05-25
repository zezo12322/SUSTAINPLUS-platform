import { describe, it, expect, vi } from 'vitest'
import bcrypt from 'bcryptjs'

vi.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: vi.fn(() => ({})),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: vi.fn(), update: vi.fn() },
  },
}))

vi.mock('next-auth', () => ({
  default: vi.fn(() => ({
    handlers: {},
    auth: vi.fn().mockResolvedValue(null),
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
}))

import { hashPassword, requireAuth, requireAdmin } from '@/lib/auth'

describe('hashPassword', () => {
  it('returns a string different from the original password', async () => {
    const hash = await hashPassword('Admin123')
    expect(hash).not.toBe('Admin123')
    expect(typeof hash).toBe('string')
  })

  it('returns a valid bcrypt hash (starts with $2b$ or $2a$)', async () => {
    const hash = await hashPassword('Admin123')
    expect(hash).toMatch(/^\$2[ab]\$/)
  })

  it('hash can be verified with bcrypt.compare', async () => {
    const password = 'MySecurePass1'
    const hash = await hashPassword(password)
    const isValid = await bcrypt.compare(password, hash)
    expect(isValid).toBe(true)
  })

  it('wrong password does not match hash', async () => {
    const hash = await hashPassword('CorrectPass1')
    const isValid = await bcrypt.compare('WrongPass1', hash)
    expect(isValid).toBe(false)
  })

  it('produces different hashes for same input (salt)', async () => {
    const hash1 = await hashPassword('Admin123')
    const hash2 = await hashPassword('Admin123')
    expect(hash1).not.toBe(hash2)
  })
})

describe('requireAuth', () => {
  it('throws UNAUTHORIZED when auth() returns null', async () => {
    await expect(requireAuth()).rejects.toThrow('UNAUTHORIZED')
  })
})

describe('requireAdmin', () => {
  it('throws FORBIDDEN when auth() returns null', async () => {
    await expect(requireAdmin()).rejects.toThrow('FORBIDDEN')
  })
})
