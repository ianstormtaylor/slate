import { expect, test } from '@playwright/test'

test.describe('markdown preview', () => {
  const slateEditor = 'div[data-slate-editor="true"]'

  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/markdown-preview')
  })

  test('checks for markdown', async ({ page }) => {
    const insertedHeading = '## Added markdown heading'

    await page.locator(slateEditor).click()
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    await page.keyboard.type(insertedHeading)
    await page.keyboard.press('Enter')

    await expect(page.locator(slateEditor)).toContainText(insertedHeading)
  })
})
