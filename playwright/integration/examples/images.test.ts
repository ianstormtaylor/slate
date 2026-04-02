import { test, expect } from '@playwright/test'

test.describe('images example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/images')
  })

  test('contains image', async ({ page }) => {
    await expect(page.getByRole('textbox').locator('img')).toHaveCount(2)
  })
})
