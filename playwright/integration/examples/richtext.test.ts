import { test, expect } from '@playwright/test'
import { dragSelection, selectStrings } from '../support/move-text'

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

    await expect(async () => {
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight)
      )
      await expect(secondParagraph).not.toBeInViewport({ timeout: 500 })
    }).toPass()

    // Undo deletion
    await editor.press('ControlOrMeta+Z')

    await expect(firstParagraph).toBeVisible()
    await expect(firstParagraph).toBeInViewport()
  })

  test('dragging the quote line moves the quote without leaving it empty', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'firefox', 'Native text drags need Firefox')
    const textbox = page.getByRole('textbox')
    await selectStrings(
      page,
      { text: 'A wise quote.', offset: 0 },
      { text: 'Try it out for yourself!', offset: 0 }
    )
    await dragSelection(page, 'A wise quote.', { text: '!', edge: 'end' })
    await expect(textbox.locator('blockquote')).toHaveCount(0)
    await expect(textbox.locator('p').first()).toContainText('!A wise quote.')
    await expect(
      textbox.locator('p', { hasText: 'Try it out for yourself!' })
    ).toHaveCount(1)
  })
})
