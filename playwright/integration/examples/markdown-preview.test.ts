import { test, expect } from '@playwright/test'

test.describe('markdown preview', () => {
  const slateEditor = 'div[data-slate-editor="true"]'
  const markdown = 'span[data-slate-string="true"]'

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/markdown-preview')
  })

  test('checks for markdown', async ({ page }) => {
    expect(await page.locator(slateEditor).locator(markdown).count()).toBe(9)

    await page.locator(slateEditor).click()
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    await page.keyboard.type('## Try it out!')
    await page.keyboard.press('Enter')
    await page.pause()
    expect(await page.locator(slateEditor).locator(markdown).count()).toBe(10)
  })
})
