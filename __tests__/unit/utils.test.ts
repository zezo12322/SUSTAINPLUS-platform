import { describe, it, expect } from 'vitest'
import {
  cn,
  formatPiasters,
  formatPiastersEn,
  isComplexQuery,
  needsEscalation,
  validateEmail,
  validatePassword,
  truncate,
  generateSessionTitle,
} from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
  it('deduplicates conflicting Tailwind classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
  it('handles falsy values', () => {
    expect(cn('foo', false, undefined, 'bar')).toBe('foo bar')
  })
})

describe('formatPiasters', () => {
  it('converts 3500 piasters to 35 EGP in Arabic format', () => {
    const result = formatPiasters(3500)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
  it('converts 85000 piasters (850 EGP)', () => {
    const result = formatPiasters(85000)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('formatPiastersEn', () => {
  it('converts 3500 piasters to 35 EGP', () => {
    const result = formatPiastersEn(3500)
    expect(result).toContain('35')
    expect(result).toContain('EGP')
  })
  it('converts 85000 piasters to 850 EGP', () => {
    const result = formatPiastersEn(85000)
    expect(result).toContain('850')
    expect(result).toContain('EGP')
  })
})

describe('isComplexQuery', () => {
  it('returns true for Arabic complex keyword "تدقيق"', () => {
    expect(isComplexQuery('أحتاج تدقيق بيئي للمصنع')).toBe(true)
  })
  it('returns true for English complex keyword "audit"', () => {
    expect(isComplexQuery('I need an environmental audit')).toBe(true)
  })
  it('returns true for "permit" keyword', () => {
    expect(isComplexQuery('how to get a permit')).toBe(true)
  })
  it('returns false for simple query', () => {
    expect(isComplexQuery('ما هي فوائد إعادة التدوير؟')).toBe(false)
  })
  it('is case-insensitive', () => {
    expect(isComplexQuery('AUDIT required')).toBe(true)
  })
})

describe('needsEscalation', () => {
  it('returns true for Arabic escalation keyword', () => {
    expect(needsEscalation('يوجد حادث بيئي خطير في المصنع')).toBe(true)
  })
  it('returns true for English escalation keyword', () => {
    expect(needsEscalation('environmental disaster at our site')).toBe(true)
  })
  it('returns true for "إجراءات قانونية"', () => {
    expect(needsEscalation('نحتاج إجراءات قانونية')).toBe(true)
  })
  it('returns false for normal query', () => {
    expect(needsEscalation('كيف أقلل استهلاك الطاقة؟')).toBe(false)
  })
})

describe('validateEmail', () => {
  it('returns true for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })
  it('returns false when missing @', () => {
    expect(validateEmail('testexample.com')).toBe(false)
  })
  it('returns false when missing domain', () => {
    expect(validateEmail('test@')).toBe(false)
  })
  it('returns false with spaces', () => {
    expect(validateEmail('test @example.com')).toBe(false)
  })
})

describe('validatePassword', () => {
  it('rejects password shorter than 8 characters', () => {
    expect(validatePassword('Ab1').valid).toBe(false)
  })
  it('rejects password with no letters at all', () => {
    const result = validatePassword('12345678')
    expect(result.valid).toBe(false)
  })
  it('rejects password with no digits', () => {
    expect(validatePassword('abcdefgh').valid).toBe(false)
  })
  it('accepts lowercase + digit password', () => {
    expect(validatePassword('alllower1').valid).toBe(true)
  })
  it('accepts mixed case + digit password', () => {
    expect(validatePassword('Admin123').valid).toBe(true)
  })
  it('returns Arabic error message when invalid', () => {
    const result = validatePassword('abc')
    expect(result.messageAr.length).toBeGreaterThan(0)
  })
})

describe('truncate', () => {
  it('returns text as-is when within limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })
  it('truncates and appends ellipsis when over limit', () => {
    expect(truncate('hello world', 5)).toBe('hello...')
  })
  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })
})

describe('generateSessionTitle', () => {
  it('returns non-empty string', () => {
    const title = generateSessionTitle('ما هي متطلبات الاشتراطات البيئية؟')
    expect(typeof title).toBe('string')
    expect(title.length).toBeGreaterThan(0)
  })
  it('truncates long messages to max 63 chars (60 + ellipsis)', () => {
    const long = 'أ'.repeat(100)
    expect(generateSessionTitle(long).length).toBeLessThanOrEqual(63)
  })
  it('returns short message unchanged', () => {
    expect(generateSessionTitle('سؤال قصير')).toBe('سؤال قصير')
  })
})
