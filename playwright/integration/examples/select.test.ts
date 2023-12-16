import { test, expect } from '@playwright/test'

test.describe('selection', () => {
  const slateEditor = '[data-slate-node="element"]'
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/richtext')
  )
  test('select the correct block when triple clicking', async ({ page }) => {
    // triple clicking the second block (paragraph) shouldn't highlight the
    // quote button
    for (let i = 0; i < 3; i++) {
      await page.locator(slateEditor).nth(1).click()
    }
    await page.pause()

    // .css-1vdn1ty is the gray, unselected button
    expect(await page.locator('.css-1vdn1ty').nth(6).textContent()).toBe(
      'format_quote'
    )
  })
})
