import { test, expect } from '@playwright/test'

// Authenticated smoke: the stored session lands on the dashboard and the
// app chrome (navbar) renders instead of bouncing back to /login.
test('authenticated session reaches the dashboard', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/dashboard/)
  // The shared Navbar shows the moons brand once authenticated.
  await expect(page.getByRole('img', { name: 'moons' }).first()).toBeVisible()
})
