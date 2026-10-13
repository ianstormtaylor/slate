import { test, expect } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

test.describe('composing in an empty editor on Android', () => {
  test('keeps the editor working when the placeholder appears mid-composition', async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== 'mobile',
      'Uses the Android input path and the Chromium DevTools protocol'
    )
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('http://localhost:3000/examples/plaintext')
    const element = page.getByRole('textbox')
    await element.click()

    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.select([])
      editor.deleteFragment()
    })

    const cdp = await page.context().newCDPSession(page)
    const word = 'composition'
    for (let step = 0; step < 40; step++) {
      const text = word.slice(0, (step % word.length) + 1)
      await cdp.send('Input.imeSetComposition', {
        text,
        selectionStart: text.length,
        selectionEnd: text.length,
      })
      await page.waitForTimeout(10)
    }
    await cdp.send('Input.insertText', { text: word })

    await expect(element.locator('[data-slate-string]')).toHaveText(word)
    await expect
      .poll(() => editor.evaluate(editor => editor.string([])))
      .toBe(word)
    expect(errors).toEqual([])
    await editor.dispose()
  })
})
