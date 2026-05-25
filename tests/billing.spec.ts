import { test, expect } from '@playwright/test'

test.describe('Pricing page', () => {
  test('page loads successfully', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page).toHaveURL(/pricing/)
  })

  test('shows Arabic name for Free plan', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('مجاني')).toBeVisible()
  })

  test('shows Arabic name for PAYG plan', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('الدفع حسب الاستخدام')).toBeVisible()
  })

  test('shows Arabic name for Standard plan', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('الباقة الأساسية')).toBeVisible()
  })

  test('shows Arabic name for Premium plan', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('الباقة المتقدمة')).toBeVisible()
  })

  test('shows Arabic name for Business plan', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText('باقة الأعمال')).toBeVisible()
  })

  test('shows 850 price for Standard plan', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.getByText(/850/).first()).toBeVisible()
  })
})

test.describe('Dashboard billing (unauthenticated)', () => {
  test('redirects /dashboard/billing to /login', async ({ page }) => {
    await page.goto('/dashboard/billing')
    await expect(page).toHaveURL(/login/)
  })
})
