import { test, expect } from '@playwright/test'

test.describe('Chat routes (unauthenticated redirects)', () => {
  test('redirects /dashboard/chat to /login', async ({ page }) => {
    await page.goto('/dashboard/chat')
    await expect(page).toHaveURL(/login/)
  })

  test('redirects /dashboard/chat/[id] to /login', async ({ page }) => {
    await page.goto('/dashboard/chat/test-session-id-12345')
    await expect(page).toHaveURL(/login/)
  })

  test('redirects /dashboard/expert to /login', async ({ page }) => {
    await page.goto('/dashboard/expert')
    await expect(page).toHaveURL(/login/)
  })
})
