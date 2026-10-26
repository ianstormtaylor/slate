import { test, expect } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

test.describe('On markdown-sync example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/markdown-sync')
  })

  test('writes editor edits to the Markdown', async ({ page }) => {
    const editor = page.getByRole('textbox', { name: 'Rich text editor' })
    await editor.click()
    const handle = await getEditorHandle(editor)
    await handle.evaluate(editor => editor.select(editor.end([2, 1])))
    await handle.dispose()
    await page.keyboard.press('Enter')
    await page.keyboard.type('Third item')

    await expect(editor.locator('li')).toHaveCount(3)
    await expect(page.getByRole('textbox', { name: 'Markdown' })).toHaveValue(
      /\* Enter in a list item starts a new one\n\* Third item\n/
    )
  })

  test('renders Markdown edits in the editor', async ({ page }) => {
    await page
      .getByRole('textbox', { name: 'Markdown' })
      .fill('## Typed **here**\n\n1. one\n2. two\n')

    const editor = page.getByRole('textbox', { name: 'Rich text editor' })
    await expect(editor.locator('h2')).toHaveText('Typed here')
    await expect(editor.locator('h2 strong')).toHaveText('here')
    await expect(editor.locator('ol li')).toHaveText(['one', 'two'])
  })
})
