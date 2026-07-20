import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const OTP_EXPIRY_MINUTES = 15
const MAX_OTP_ATTEMPTS = 5

export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString()
}

/** OTP codes are never stored in plaintext — only their SHA-256 hash. */
function hashCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex')
}

export async function createOtp(userId: string, type: 'EMAIL_VERIFY' | 'PASSWORD_RESET' | 'TWO_FACTOR') {
  // Invalidate existing OTPs of same type
  await prisma.otpCode.updateMany({
    where: { userId, type, usedAt: null },
    data: { usedAt: new Date() },
  })

  // Opportunistic cleanup of long-expired rows so the table can't grow forever.
  prisma.otpCode
    .deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } })
    .catch(() => {})

  const code = generateOtpCode()
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

  await prisma.otpCode.create({
    data: { userId, code: hashCode(code), type, expiresAt },
  })

  // The raw code is returned once (to be emailed); it is not persisted.
  return code
}

export async function verifyOtp(
  userId: string,
  code: string,
  type: 'EMAIL_VERIFY' | 'PASSWORD_RESET' | 'TWO_FACTOR'
): Promise<boolean> {
  // Look up the latest active OTP for this (user, type) regardless of code match,
  // so we can enforce a per-code attempt cap even when hashes don't match.
  const otp = await prisma.otpCode.findFirst({
    where: {
      userId,
      type,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!otp) return false

  // Too many wrong guesses → burn the code (brute-force protection).
  if (otp.attempts >= MAX_OTP_ATTEMPTS) {
    await prisma.otpCode.update({ where: { id: otp.id }, data: { usedAt: new Date() } })
    return false
  }

  const matches = crypto.timingSafeEqual(
    Buffer.from(otp.code, 'hex'),
    Buffer.from(hashCode(code), 'hex')
  )

  if (!matches) {
    const attempts = otp.attempts + 1
    await prisma.otpCode.update({
      where: { id: otp.id },
      // Burn the code once the cap is reached so it can't be retried.
      data: { attempts, usedAt: attempts >= MAX_OTP_ATTEMPTS ? new Date() : null },
    })
    return false
  }

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { usedAt: new Date() },
  })

  return true
}
