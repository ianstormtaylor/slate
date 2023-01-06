import { test, expect } from '@playwright/test'

test.describe('Inlines example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/inlines')
  })

  test('contains link', async ({ page }) => {
    expect(
      await page
        .getByRole('textbox')
        .locator('a')
        .nth(0)
        .innerText()
    ).toContain('hyperlink')
  })
})
