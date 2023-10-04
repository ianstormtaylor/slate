import { test, expect } from '@playwright/test'

test.describe('images example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/images')
  })

  test('contains image', async ({ page }) => {
    expect(
      await page
        .getByRole('textbox')
        .locator('img')
        .count()
    ).toBe(2)
  })
})
