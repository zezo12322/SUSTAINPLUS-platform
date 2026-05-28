import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const OTP_EXPIRY_MINUTES = 15

export function generateOtpCode(): string {
  return crypto.randomInt(100000, 999999).toString()
}

export async function createOtp(userId: string, type: 'EMAIL_VERIFY' | 'PASSWORD_RESET' | 'TWO_FACTOR') {
  // Invalidate existing OTPs of same type
  await prisma.otpCode.updateMany({
    where: { userId, type, usedAt: null },
    data: { usedAt: new Date() },
  })

  const code = generateOtpCode()
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

  await prisma.otpCode.create({
    data: { userId, code, type, expiresAt },
  })

  return code
}

export async function verifyOtp(
  userId: string,
  code: string,
  type: 'EMAIL_VERIFY' | 'PASSWORD_RESET' | 'TWO_FACTOR'
): Promise<boolean> {
  const otp = await prisma.otpCode.findFirst({
    where: {
      userId,
      code,
      type,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!otp) return false

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { usedAt: new Date() },
  })

  return true
}
