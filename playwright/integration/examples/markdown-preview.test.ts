import { test, expect } from '@playwright/test'
import { clearEditor } from '../support/editor'

test.describe('markdown preview', () => {
  const slateEditor = 'div[data-slate-editor="true"]'
  const markdown = 'span[data-slate-string="true"]'

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/markdown-preview')
  })

  test('renders nested emphasis in a heading at the correct offsets', async ({
    page,
  }) => {
    const editor = page.locator(slateEditor)
    await clearEditor(editor)
    await editor.pressSequentially('## Plain *italic* and **bold** end')

    await expect(
      editor.locator(markdown).filter({ hasText: /^\*italic\*$/ })
    ).toHaveCSS('font-style', 'italic')
    await expect(
      editor.locator(markdown).filter({ hasText: /^\*\*bold\*\*$/ })
    ).toHaveCSS('font-weight', '700')
    await expect(
      editor.locator(markdown).filter({ hasText: /^\*italic\*$/ })
    ).toHaveCSS('font-size', '20px')
    await expect(
      editor.locator(markdown).filter({ hasText: /^ end$/ })
    ).toHaveCSS('font-style', 'normal')
    await expect(editor).toHaveText('## Plain *italic* and **bold** end')
  })

  test('preserves nested emphasis and literal code in a heading', async ({
    page,
  }) => {
    const editor = page.locator(slateEditor)
    await clearEditor(editor)
    await editor.pressSequentially('## **bold _nested_** and `*plain*`')

    await expect(
      editor.locator(markdown).filter({ hasText: /^_nested_$/ })
    ).toHaveCSS('font-style', 'italic')
    await expect(
      editor.locator(markdown).filter({ hasText: /^ and `\*plain\*`$/ })
    ).toHaveCSS('font-style', 'normal')
    await expect(editor).toHaveText('## **bold _nested_** and `*plain*`')
  })

  test('keeps an unformatted heading in one leaf', async ({ page }) => {
    const editor = page.locator(slateEditor)
    await clearEditor(editor)
    await editor.pressSequentially('## Plain heading')
    await expect(editor.locator('[data-slate-leaf]')).toHaveCount(1)
    await expect(editor.locator(markdown)).toHaveCSS('font-size', '20px')
  })

  test('checks for markdown', async ({ page }) => {
    const editor = page.locator(slateEditor)
    await expect(
      editor.locator(markdown).filter({ hasText: /^\*\*decorations\*\*$/ })
    ).toHaveCSS('font-weight', '700')
    await expect(
      editor.locator(markdown).filter({ hasText: /^_dead_$/ })
    ).toHaveCSS('font-style', 'italic')

    await editor.click()
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    await page.keyboard.type('## Another heading')
    await page.keyboard.press('Enter')
    await expect(
      editor.locator(markdown).filter({ hasText: /^## Another heading$/ })
    ).toHaveCSS('font-size', '20px')
  })
})
