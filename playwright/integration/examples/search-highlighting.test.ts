import { test, expect } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

test.describe('search highlighting', () => {
  test.beforeEach(
    async ({ page }) => await page.goto('/examples/search-highlighting')
  )

  test('highlights the searched text', async ({ page }) => {
    const searchField = 'input[type="search"]'
    const highlightedText = 'search-highlighted'

    await page.locator(searchField).fill('text')
    await expect(page.locator(`[data-cy="${highlightedText}"]`)).toHaveCount(2)
  })

  test('ignores case across formatted leaves and preserves offsets', async ({
    page,
  }) => {
    const element = page.getByRole('textbox')
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.children = [
        {
          children: [
            { text: 'İ prefix Te' },
            { text: 'XT', bold: true },
            { text: ' text TEXT' },
          ],
        },
      ]
      editor.onChange()
    })
    await editor.dispose()
    await expect(element).toHaveText('İ prefix TeXT text TEXT')
    await page.locator('input[type="search"]').fill('tExT')
    await expect(page.locator('[data-cy="search-highlighted"]')).toHaveText([
      'Te',
      'XT',
      'text',
      'TEXT',
    ])
    await expect(element).toHaveText('İ prefix TeXT text TEXT')
    await page.locator('input[type="search"]').fill('')
    await expect(page.locator('[data-cy="search-highlighted"]')).toHaveCount(0)
  })

  test('treats regular expression characters as literal search text', async ({
    page,
  }) => {
    const element = page.getByRole('textbox')
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.children = [{ children: [{ text: 'A+B [Text] a+b [text]' }] }]
      editor.onChange()
    })
    await editor.dispose()
    await page.locator('input[type="search"]').fill('a+b')
    await expect(page.locator('[data-cy="search-highlighted"]')).toHaveText([
      'A+B',
      'a+b',
    ])
    await page.locator('input[type="search"]').fill('[TEXT]')
    await expect(page.locator('[data-cy="search-highlighted"]')).toHaveText([
      '[Text]',
      '[text]',
    ])
  })

  test('a re-render right after a click keeps the clicked selection', async ({
    page,
  }) => {
    const editor = page.getByRole('textbox')
    await editor.click()
    await page.waitForTimeout(200)

    await page.evaluate(async () => {
      const textOf = (text: string) => {
        const match = Array.from(
          document.querySelectorAll('[data-slate-string]')
        ).find(element => element.textContent?.startsWith(text))
        return match!.firstChild!
      }
      const sleep = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms))
      const selection = window.getSelection()!
      const search = document.querySelector<HTMLInputElement>(
        'input[type="search"]'
      )!
      const setSearchValue = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      )!.set!

      selection.setBaseAndExtent(textOf('This is'), 1, textOf('This is'), 1)
      await sleep(20)
      selection.setBaseAndExtent(textOf('Try it'), 3, textOf('Try it'), 3)
      await sleep(5)
      setSearchValue.call(search, 'x')
      search.dispatchEvent(new Event('input', { bubbles: true }))
    })

    await page.waitForTimeout(300)
    await page.keyboard.type('Z')
    await expect(editor).toContainText('TryZ it out')
  })
})
