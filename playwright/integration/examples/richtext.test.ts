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

  test('arrow keys scroll just enough to reveal the caret', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 800, height: 600 })
    await page.getByRole('textbox').click()
    await page.evaluate(() => {
      const element = document.querySelector('[data-slate-editor]')!
      const fiberKey = Object.keys(element).find(key =>
        key.startsWith('__reactFiber$')
      )!
      let fiber = (element as any)[fiberKey]
      while (fiber && !fiber.memoizedProps?.editor) {
        fiber = fiber.return
      }
      const editor = fiber.memoizedProps.editor
      const lines = Array.from({ length: 60 }, (_, index) => ({
        type: 'paragraph',
        children: [{ text: `Line ${index}` }],
      }))
      editor.insertNodes(lines, { at: [editor.children.length] })
      const target = editor.children.length - 30
      editor.select({ path: [target, 0], offset: 0 })
    })
    await page.waitForTimeout(300)

    const before = await page.evaluate(() => {
      const caretLine = window.getSelection()!.anchorNode!.parentElement!
      window.scrollBy(0, caretLine.getBoundingClientRect().top - 2)
      return window.scrollY
    })
    await page.waitForTimeout(300)
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(300)
    const after = await page.evaluate(() => window.scrollY)

    expect(before - after).toBeGreaterThan(0)
    expect(before - after).toBeLessThan(120)
  })
})
