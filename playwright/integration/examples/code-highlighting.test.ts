import { test, expect } from '@playwright/test'

test.describe('code highlighting', () => {
  const slateEditor = '[data-slate-node="element"]'
  const leafNode = 'span[data-slate-leaf="true"]'

  test.beforeEach(async ({ page }) => {
    page.goto('http://localhost:3000/examples/code-highlighting')
  })

  test('highlights HTML tags', async ({ page }) => {
    const outer = page
      .locator(slateEditor)
      .locator('span')
      .nth(0)
      .locator(leafNode)
      .nth(0)
    await expect(await outer.textContent()).toContain('<h1>')
    await expect(outer).toHaveCSS('color', 'rgb(153, 0, 85)')
  })

  test('highlights javascript syntax', async ({ page }) => {
    const JSCode = 'const slateVar = 30;'
    await page.locator('select').selectOption('JavaScript') // Select the 'JavaScript' option
    await expect(await page.locator('select').inputValue()).toBe('js') // Confirm value to avoid race condition

    await page.locator(slateEditor).click() // focus on the editor
    const isMac = await page.evaluate(() => {
      return /Mac|iPhone|iPod|iPad/i.test(navigator.platform)
    })
    if (isMac) {
      await page.keyboard.press('Meta+A')
    } else {
      await page.keyboard.press('Control+A')
    }
    await page.keyboard.type(JSCode) // Type JavaScript code
    await page.keyboard.press('Enter')

    expect(
      await page
        .locator(slateEditor)
        .locator('span')
        .nth(0)
        .locator(leafNode)
        .nth(0)
        .textContent()
    ).toContain('const')
    await expect(
      page
        .locator(slateEditor)
        .locator('span')
        .nth(0)
        .locator(leafNode)
        .nth(0)
    ).toHaveCSS('color', 'rgb(0, 119, 170)')
  })
})
