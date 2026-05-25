import { describe, it, expect } from 'vitest'
import {
  PLANS,
  AI_MODELS,
  MIN_PAYG_PRICE_PIASTERS,
  CONSULTATION_PACKS,
  RATE_LIMITS,
} from '@/lib/constants'

describe('MIN_PAYG_PRICE_PIASTERS', () => {
  it('is exactly 3500 (35 EGP) — critical business rule', () => {
    expect(MIN_PAYG_PRICE_PIASTERS).toBe(3500)
  })
})

describe('PLANS', () => {
  it('has exactly 5 plan keys', () => {
    expect(Object.keys(PLANS)).toHaveLength(5)
  })

  it('contains all expected slugs', () => {
    const slugs = Object.values(PLANS).map((p) => p.slug)
    expect(slugs).toContain('free')
    expect(slugs).toContain('payg')
    expect(slugs).toContain('standard')
    expect(slugs).toContain('premium')
    expect(slugs).toContain('business')
  })

  it('FREE plan has 3 consultations per month', () => {
    expect(PLANS.FREE.consultationsPerMonth).toBe(3)
  })

  it('STANDARD plan price is 85000 piasters (850 EGP)', () => {
    expect(PLANS.STANDARD.pricePiasters).toBe(85000)
  })

  it('PREMIUM plan price is 225000 piasters (2,250 EGP)', () => {
    expect(PLANS.PREMIUM.pricePiasters).toBe(225000)
  })

  it('BUSINESS plan price is 450000 piasters (4,500 EGP)', () => {
    expect(PLANS.BUSINESS.pricePiasters).toBe(450000)
  })

  it('no plan features contain the word "unlimited"', () => {
    for (const plan of Object.values(PLANS)) {
      const features = [
        ...((plan as any).featuresAr ?? []),
        ...((plan as any).featuresEn ?? []),
      ]
      for (const feature of features) {
        expect((feature as string).toLowerCase()).not.toContain('unlimited')
      }
    }
  })

  it('each plan has a non-empty slug', () => {
    for (const plan of Object.values(PLANS)) {
      expect(typeof plan.slug).toBe('string')
      expect(plan.slug.length).toBeGreaterThan(0)
    }
  })
})

describe('AI_MODELS', () => {
  it('has simple and complex keys', () => {
    expect(AI_MODELS).toHaveProperty('simple')
    expect(AI_MODELS).toHaveProperty('complex')
  })

  it('simple model is a haiku variant', () => {
    expect(AI_MODELS.simple.toLowerCase()).toContain('haiku')
  })

  it('complex model is a sonnet variant', () => {
    expect(AI_MODELS.complex.toLowerCase()).toContain('sonnet')
  })
})

describe('CONSULTATION_PACKS', () => {
  it('pack_1 price equals MIN_PAYG_PRICE_PIASTERS', () => {
    const pack1 = CONSULTATION_PACKS.find((p) => p.id === 'pack_1')
    expect(pack1?.pricePiasters).toBe(MIN_PAYG_PRICE_PIASTERS)
  })

  it('has 3 pack options', () => {
    expect(CONSULTATION_PACKS).toHaveLength(3)
  })
})

describe('RATE_LIMITS', () => {
  it('chat limit is 20 requests per 60 seconds', () => {
    expect(RATE_LIMITS.chat.requests).toBe(20)
    expect(RATE_LIMITS.chat.windowSeconds).toBe(60)
  })
})
