import { test, expect } from '@playwright/test'

test.describe('readonly editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/read-only')
  })

  test('should not be editable', async ({ page }) => {
    const slateEditor = '[data-slate-editor="true"]'
    expect(
      await page.locator(slateEditor).getAttribute('contentEditable')
    ).toBe('false')
    expect(await page.locator(slateEditor).getAttribute('role')).toBe(null)
    await page.locator(slateEditor).click()
    await expect(page.locator(slateEditor)).not.toBeFocused()
  })
})
