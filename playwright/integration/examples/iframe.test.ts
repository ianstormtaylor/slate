import { test, expect, Page } from '@playwright/test'

test.describe('iframe editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/iframe')
  })

  test('should be editable', async ({ page }) => {
    await page
      .frameLocator('iframe')
      .locator('body')
      .getByRole('textbox')
      .focus()
    await page.keyboard.press('Home')
    await page.keyboard.type('Hello World')
    expect(
      await page
        .frameLocator('iframe')
        .locator('body')
        .getByRole('textbox')
        .textContent()
    ).toContain('Hello World')
  })
})
