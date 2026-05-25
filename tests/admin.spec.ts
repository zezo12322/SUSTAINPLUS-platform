import { test, expect } from '@playwright/test'

test.describe('Admin routes (unauthenticated redirects)', () => {
  test('redirects /admin to /login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/login/)
  })

  test('redirects /admin/users to /login', async ({ page }) => {
    await page.goto('/admin/users')
    await expect(page).toHaveURL(/login/)
  })

  test('redirects /admin/expert-cases to /login', async ({ page }) => {
    await page.goto('/admin/expert-cases')
    await expect(page).toHaveURL(/login/)
  })

  test('redirects /admin/kb to /login', async ({ page }) => {
    await page.goto('/admin/kb')
    await expect(page).toHaveURL(/login/)
  })
})
