import { test, expect } from '@playwright/test'

test.describe('Pricing page', () => {
  test('page loads successfully', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page).toHaveURL(/pricing/)
  })

  test('shows Arabic name for Free plan', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByRole('heading', { name: 'مجاني' }).first()).toBeVisible()
  })

  test('shows Arabic name for PAYG plan', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('الدفع حسب الاستخدام').first()).toBeVisible()
  })

  test('shows Arabic name for Standard plan', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('الباقة الأساسية').first()).toBeVisible()
  })

  test('shows Arabic name for Premium plan', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('الباقة المتقدمة').first()).toBeVisible()
  })

  test('shows Arabic name for Business plan', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('باقة الأعمال').first()).toBeVisible()
  })

  test('shows Standard plan price in Arabic numerals', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('٨٥٠ ج.م').first()).toBeVisible()
  })
})

test.describe('Dashboard billing (unauthenticated)', () => {
  test('redirects /dashboard/billing to /login', async ({ page }) => {
    await page.goto('/dashboard/billing')
    await expect(page).toHaveURL(/login/)
  })
})
