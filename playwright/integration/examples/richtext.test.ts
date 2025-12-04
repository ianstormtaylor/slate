import { test, expect } from '@playwright/test'

test.describe('On richtext example', () => {
  test.beforeEach(
    async ({ page }) =>
      await page.goto('http://localhost:3000/examples/richtext')
  )

  test('renders rich text', async ({ page }) => {
    expect(await page.locator('strong').nth(0).textContent()).toContain('rich')
    expect(await page.locator('blockquote').textContent()).toContain(
      'wise quote'
    )
  })

  test('inserts text when typed', async ({ page }) => {
    await page.getByRole('textbox').press('Home')
    await page.getByRole('textbox').pressSequentially('Hello World')

    expect(await page.getByRole('textbox').textContent()).toContain(
      'Hello World'
    )
  })

  test('undo scrolls back to restored text after deletion and scroll away', async ({
    page,
  }) => {
    const editor = page.getByRole('textbox')

    await editor.press('ControlOrMeta+A')
    await editor.pressSequentially('First paragraph.')
    await editor.press('Enter')
    await editor.pressSequentially('Second paragraph.')

    // Insert enough content to be scrollable
    for (let i = 0; i < 20; i++) {
      await editor.press('Enter')
      await editor.pressSequentially('Extra paragraph.')
    }

    const firstParagraph = editor.getByText('First paragraph.')
    const secondParagraph = editor.getByText('Second paragraph.')

    // Scroll back to top and select first paragraph
    await firstParagraph.click({ clickCount: 3 })

    await expect(firstParagraph).toBeVisible()
    await expect(firstParagraph).toBeInViewport()
    await expect(secondParagraph).toBeVisible()
    await expect(secondParagraph).toBeInViewport()

    await editor.press('Backspace')
    await expect(firstParagraph).toBeHidden()

    await editor.press(
      process.platform === 'darwin' ? 'Meta+ArrowDown' : 'Control+End'
    )
    await expect(secondParagraph).not.toBeInViewport()

    // Undo deletion
    await editor.press('ControlOrMeta+Z')

    await expect(firstParagraph).toBeVisible()
    await expect(firstParagraph).toBeInViewport()
  })
})
