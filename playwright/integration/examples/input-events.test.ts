import { test, expect } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

test.describe('On input-events example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/input-events')
  })

  test('logs the events and model text for typing', async ({ page }) => {
    const editor = page.getByRole('textbox', { name: 'Input events editor' })
    const log = page.getByRole('textbox', { name: 'Input event log' })
    await editor.click()
    const handle = await getEditorHandle(editor)
    await handle.evaluate(editor => editor.select(editor.end([2])))
    await handle.dispose()
    await page.keyboard.type('!')

    await expect(log).toHaveValue(/^userAgent /)
    await expect(log).toHaveValue(/ beforeinput insertText "!"/)
    await expect(log).toHaveValue(/ change "A wise quote\.!" sel=2\.0:14/)
  })

  test('clears the log', async ({ page }) => {
    const editor = page.getByRole('textbox', { name: 'Input events editor' })
    const log = page.getByRole('textbox', { name: 'Input event log' })
    await editor.click()
    await page.keyboard.type('x')
    await expect(log).toHaveValue(/ change /)

    await page.getByRole('button', { name: 'Clear log' }).click()
    await expect(log).toHaveValue(/^userAgent [^\n]*$/)
  })
})
