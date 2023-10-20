import { test, expect } from '@playwright/test'

test.describe('table example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/tables')
  })

  test('table tag rendered', async ({ page }) => {
    await expect(page.getByRole('textbox').locator('table')).toHaveCount(1)
  })
})
