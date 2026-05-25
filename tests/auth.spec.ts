import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('login page loads with form fields', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveURL(/login/)
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('shows error message for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'nonexistent@test.com')
    await page.fill('input[type="password"]', 'wrongpassword123')
    await page.click('button[type="submit"]')
    await expect(
      page.locator('[class*="red"], [class*="error"], [role="alert"]').first()
    ).toBeVisible({ timeout: 8000 })
  })

  test('register page loads with form', async ({ page }) => {
    await page.goto('/register')
    await expect(page).toHaveURL(/register/)
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
  })

  test('redirects unauthenticated user from /dashboard to /login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/login/)
  })

  test('redirects unauthenticated user from /dashboard/chat to /login', async ({ page }) => {
    await page.goto('/dashboard/chat')
    await expect(page).toHaveURL(/login/)
  })

  test('redirects unauthenticated user from /dashboard/billing to /login', async ({ page }) => {
    await page.goto('/dashboard/billing')
    await expect(page).toHaveURL(/login/)
  })
})
