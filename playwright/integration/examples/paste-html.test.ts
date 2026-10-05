import { test, expect, Page } from '@playwright/test'

test.describe('paste html example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/paste-html')
  )

  // Editable ignores paste events it did not get from the user, so these drive
  // a real one: put the html on the clipboard, then press the paste shortcut.
  // Only the chromium project grants clipboard permissions.
  test.skip(
    ({}, testInfo) => testInfo.project.name !== 'chromium',
    'pasting for real needs clipboard permissions'
  )

  const pasteHtml = async (page: Page, htmlContent: string) => {
    await page.getByRole('textbox').click()
    await page.getByRole('textbox').selectText()
    await page.keyboard.press('Backspace')

    await page.evaluate(async html => {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
        }),
      ])
    }, htmlContent)

    await page.keyboard.press('ControlOrMeta+V')
  }

  test('pasted bold text uses <strong>', async ({ page }) => {
    await pasteHtml(page, '<strong>Hello Bold</strong>')
    expect(await page.locator('strong').textContent()).toContain('Hello')
  })

  test('pasted code uses <code>', async ({ page }) => {
    await pasteHtml(page, '<code>console.log("hello from slate!")</code>')
    expect(await page.locator('code').textContent()).toContain('slate!')
  })
})
