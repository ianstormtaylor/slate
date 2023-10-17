import { test, expect } from '@playwright/test'

test.describe('embeds example', () => {
  const slateEditor = 'div[data-slate-editor="true"]'

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/embeds')
  })

  test('contains embeded', async ({ page }) => {
    expect(await page.locator(slateEditor).locator('iframe').count()).toBe(1)
  })
})
