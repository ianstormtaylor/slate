import { test, expect } from '@playwright/test'

test.describe('shadow-dom example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/shadow-dom')
  )

  test('renders slate editor inside nested shadow', async ({ page }) => {
    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')

    await expect(innerShadow.getByRole('textbox')).toHaveCount(1)
  })

  test('renders slate editor inside nested shadow and edits content', async ({
    page,
  }) => {
    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')
    const textbox = innerShadow.getByRole('textbox')

    // Ensure the textbox is present
    await expect(textbox).toHaveCount(1)

    // Clear any existing text and type new text into the textbox
    await textbox.click()
    await page.keyboard.press('Meta+A')

    await page.keyboard.press('Backspace')
    await page.keyboard.type('Hello, Playwright!')

    // Assert that the textbox contains the correct text
    await expect(textbox).toHaveText('Hello, Playwright!')
  })

  test('user can type add a new line in editor inside shadow DOM', async ({
    page,
  }) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    const pageErrors: Error[] = []
    page.on('pageerror', error => {
      pageErrors.push(error)
    })

    const outerShadow = page.locator('[data-cy="outer-shadow-root"]')
    const innerShadow = outerShadow.locator('> div')
    const textbox = innerShadow.getByRole('textbox')

    // Add text in a new line
    await textbox.click()
    await page.keyboard.press('Enter')
    await page.keyboard.type('New line text')

    expect(consoleErrors, 'Console errors occurred').toEqual([])
    expect(pageErrors, 'Page errors occurred').toEqual([])

    await expect(textbox).toContainText('New line text')
  })
})
