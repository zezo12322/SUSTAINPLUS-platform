import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'
import { COMPLEX_QUERY_KEYWORDS, ESCALATION_KEYWORDS } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPiasters(piasters: number): string {
  const egp = piasters / 100
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(egp)
}

export function formatPiastersEn(piasters: number): string {
  const egp = piasters / 100
  return `${egp.toLocaleString('en-EG')} EGP`
}

export function getMonthYear(date: Date = new Date()): string {
  return format(date, 'yyyy-MM')
}

export function formatDateAr(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd MMMM yyyy', { locale: ar })
}

export function formatDateTimeAr(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd MMMM yyyy - hh:mm a', { locale: ar })
}

export function isComplexQuery(text: string): boolean {
  const lower = text.toLowerCase()
  return COMPLEX_QUERY_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()))
}

export function needsEscalation(text: string): boolean {
  const lower = text.toLowerCase()
  return ESCALATION_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()))
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateSessionTitle(firstMessage: string): string {
  return truncate(firstMessage, 60)
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password: string): { valid: boolean; messageAr: string } {
  if (password.length < 8) {
    return { valid: false, messageAr: 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل' }
  }
  if (!/[A-Z]/.test(password) && !/[a-z]/.test(password)) {
    return { valid: false, messageAr: 'كلمة المرور يجب أن تحتوي على حروف' }
  }
  if (!/\d/.test(password)) {
    return { valid: false, messageAr: 'كلمة المرور يجب أن تحتوي على أرقام' }
  }
  return { valid: true, messageAr: '' }
}

export function getPlanLimitMessage(consultationsUsed: number, limit: number): string {
  const remaining = limit - consultationsUsed
  if (remaining <= 0) return 'لقد استنفدت استشاراتك الشهرية'
  if (remaining === 1) return 'لديك استشارة واحدة متبقية هذا الشهر'
  if (remaining <= 3) return `لديك ${remaining} استشارات متبقية فقط هذا الشهر`
  return `لديك ${remaining} استشارة متبقية هذا الشهر`
}

export function getArabicOrdinal(n: number): string {
  const ordinals: Record<number, string> = {
    1: 'الأول', 2: 'الثاني', 3: 'الثالث', 4: 'الرابع', 5: 'الخامس',
  }
  return ordinals[n] || `${n}`
}
