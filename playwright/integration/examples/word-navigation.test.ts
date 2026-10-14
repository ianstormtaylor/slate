import { expect, test, Locator } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

const wordModifier = process.platform === 'darwin' ? 'Alt' : 'Control'

const offsets = async (
  element: Locator,
  direction: 'Left' | 'Right',
  length: number,
  native: boolean
) => {
  const result: number[] = []
  let previous = direction === 'Right' ? 0 : length
  while (previous !== (direction === 'Right' ? length : 0)) {
    await element.press(`${wordModifier}+Arrow${direction}`)
    const read = () =>
      element.evaluate((element, native) => {
        if (native) return (element as HTMLInputElement).selectionStart!
        const selection = window.getSelection()!
        const range = document.createRange()
        range.selectNodeContents(element)
        range.setEnd(selection.focusNode!, selection.focusOffset)
        return range.toString().length
      }, native)
    await expect.poll(read).not.toBe(previous)
    previous = await read()
    result.push(previous)
    expect(result.length).toBeLessThanOrEqual(length)
  }
  return result
}

for (const text of [
  'hello, world.',
  'Test1. test2, [...] test3 (US) and Test4',
]) {
  test(`word navigation matches a native input: ${text}`, async ({
    browser,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop keyboard navigation')
    const context = await browser.newContext({ userAgent: undefined })
    const page = await context.newPage()
    try {
      await page.goto(
        (process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000') +
          '/examples/plaintext'
      )
      const editable = page.locator('[data-slate-editor]')
      await editable.click()
      const editor = await getEditorHandle(editable)
      await editor.evaluate((editor, text) => {
        editor.select({ anchor: editor.start([]), focus: editor.end([]) })
        editor.insertText(text)
      }, text)
      await expect(editable).toHaveText(text)
      await page.evaluate(text => {
        const input = document.createElement('input')
        input.setAttribute('data-test-id', 'native-word-input')
        input.value = text
        document.body.prepend(input)
      }, text)
      const input = page.getByTestId('native-word-input')
      for (const direction of ['Right', 'Left'] as const) {
        const start = direction === 'Right' ? 0 : text.length
        await input.focus()
        await input.evaluate(
          (input, start) => input.setSelectionRange(start, start),
          start
        )
        const expected = await offsets(input, direction, text.length, true)
        await editable.click()
        await editor.evaluate(
          (editor, start) => editor.select({ path: [0, 0], offset: start }),
          start
        )
        await expect
          .poll(() =>
            editable.evaluate(() => window.getSelection()?.focusOffset)
          )
          .toBe(start)
        expect(await offsets(editable, direction, text.length, false)).toEqual(
          expected
        )
      }
      await editor.dispose()
    } finally {
      await context.close()
    }
  })
}
