import { expect, test } from '@playwright/test'
import { getEditorHandle } from './support/editor'

for (const key of ['Backspace', 'Delete']) {
  test(`${key} calls the override once at the document boundary`, async ({
    page,
  }) => {
    await page.goto('/examples/plaintext')
    const element = page.getByRole('textbox')
    const editor = await getEditorHandle(element)
    await element.focus()
    const calls = await editor.evaluateHandle((editor, key) => {
      const calls: string[] = []
      const method = key === 'Backspace' ? 'deleteBackward' : 'deleteForward'
      const original = editor[method]
      editor[method] = unit => {
        calls.push(unit)
        original(unit)
      }
      editor.select(key === 'Backspace' ? editor.start([]) : editor.end([]))
      return calls
    }, key)
    await expect
      .poll(() =>
        element.evaluate((element, key) => {
          const text = element.querySelector('[data-slate-string]')!.firstChild!
          const selection = window.getSelection()!
          return (
            selection.anchorNode === text &&
            selection.anchorOffset ===
              (key === 'Backspace' ? 0 : text.textContent!.length)
          )
        }, key)
      )
      .toBe(true)
    await page.keyboard.press(key)
    await expect
      .poll(() => calls.evaluate(calls => calls))
      .toEqual(['character'])
    await calls.dispose()
    await editor.dispose()
  })
}
