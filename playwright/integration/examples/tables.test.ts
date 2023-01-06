import { test, expect } from '@playwright/test'

test.describe('table example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/tables')
  })

  test('table tag rendered', async ({ page }) => {
    expect(
      await page
        .getByRole('textbox')
        .locator('table')
        .count()
    ).toBe(1)
  })
})
