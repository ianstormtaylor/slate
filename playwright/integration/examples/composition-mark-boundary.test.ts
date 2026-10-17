import { test, expect } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

test.describe('composing at the end of marked text', () => {
  test('keeps one copy of text composed after moving left onto a mark boundary', async ({
    page,
    browserName,
  }, info) => {
    test.skip(
      browserName !== 'chromium' || info.project.name === 'mobile',
      'Drives the IME through the Chromium DevTools protocol'
    )
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('/examples/richtext')
    const element = page.getByRole('textbox')
    await element.click()

    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.select({ path: [0, 2], offset: 1 })
    })
    await element.press('ArrowLeft')

    const cdp = await page.context().newCDPSession(page)
    for (const text of ['n', 'ni', 'ni h', 'ni ha', 'ni hao']) {
      await cdp.send('Input.imeSetComposition', {
        text,
        selectionStart: text.length,
        selectionEnd: text.length,
      })
    }
    await cdp.send('Input.insertText', { text: '你好' })

    const firstBlock = element.locator('[data-slate-node="element"]').first()
    await expect(firstBlock).toHaveText(
      'This is editable rich你好 text, much better than a <textarea>!'
    )
    expect(await editor.evaluate(editor => editor.string([0]))).toBe(
      'This is editable rich你好 text, much better than a <textarea>!'
    )
    expect(errors).toEqual([])
    await editor.dispose()
  })
})
