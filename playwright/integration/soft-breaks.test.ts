import { expect, test } from '@playwright/test'
import { clearEditor, getEditorHandle } from './support/editor'

test.beforeEach(async ({ page }) => {
  await page.goto('/examples/plaintext')
})

test('a trailing soft break puts the caret on the new line', async ({
  page,
  browserName,
}) => {
  const element = page.getByRole('textbox')
  await clearEditor(element)
  await page.keyboard.type('abc')
  const editor = await getEditorHandle(element)
  const firstLine = await element.evaluate(() =>
    window.getSelection()!.getRangeAt(0).getBoundingClientRect().toJSON()
  )
  const lineHeight = await element.evaluate(element =>
    parseFloat(getComputedStyle(element).lineHeight)
  )

  for (let count = 1; count <= 2; count++) {
    await editor.evaluate(editor => editor.insertText('\n'))
    await expect
      .poll(() => editor.evaluate(editor => editor.selection?.anchor.offset))
      .toBe(3 + count)
    if (browserName !== 'chromium') {
      await expect
        .poll(() =>
          element.evaluate(
            () =>
              window.getSelection()!.getRangeAt(0).getBoundingClientRect().top
          )
        )
        .toBeCloseTo(firstLine.top + lineHeight * count, 0)
    }
  }

  await page.keyboard.type('Z')
  await expect
    .poll(() => editor.evaluate(editor => editor.string([])))
    .toBe('abc\n\nZ')
  await page.keyboard.press('Backspace')
  await page.keyboard.press('Backspace')
  await expect
    .poll(() => editor.evaluate(editor => editor.string([])))
    .toBe('abc\n')
  await page.keyboard.type('Q')
  await expect
    .poll(() => editor.evaluate(editor => editor.string([])))
    .toBe('abc\nQ')
  await editor.dispose()
})

test('moving past a trailing soft break keeps selection inside the text', async ({
  page,
}) => {
  const element = page.getByRole('textbox')
  await clearEditor(element)
  await page.keyboard.type('abc')
  const editor = await getEditorHandle(element)
  await editor.evaluate(editor => editor.insertText('\n'))
  await expect(element).toHaveText('abc\n\n')
  await page.keyboard.press('ArrowDown')
  await expect
    .poll(() => editor.evaluate(editor => editor.selection))
    .toEqual({
      anchor: { path: [0, 0], offset: 4 },
      focus: { path: [0, 0], offset: 4 },
    })
  await page.keyboard.type('Z')
  await expect
    .poll(() => editor.evaluate(editor => editor.string([])))
    .toBe('abc\nZ')
  await editor.dispose()
})

for (const backward of [false, true]) {
  test(`selects both trailing newlines ${
    backward ? 'backward' : 'forward'
  }`, async ({ page }) => {
    const element = page.getByRole('textbox')
    await clearEditor(element)
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => editor.insertText('abc\n\n'))
    await expect(element).toHaveText('abc\n\n\n')
    await element.evaluate((element, backward) => {
      const text = element.querySelector('[data-slate-string]')!.firstChild!
      window
        .getSelection()!
        .setBaseAndExtent(text, backward ? 5 : 0, text, backward ? 0 : 5)
    }, backward)
    await expect
      .poll(() => editor.evaluate(editor => editor.selection))
      .toEqual({
        anchor: { path: [0, 0], offset: backward ? 5 : 0 },
        focus: { path: [0, 0], offset: backward ? 0 : 5 },
      })
    await page.keyboard.press('Backspace')
    await expect
      .poll(() => editor.evaluate(editor => editor.string([])))
      .toBe('')
    await editor.dispose()
  })
}

for (const example of ['richtext', 'tables', 'mentions', 'shadow-dom']) {
  test(`a trailing soft break keeps editing in ${example}`, async ({
    page,
    browserName,
  }) => {
    await page.goto(`/examples/${example}`)
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    const element = page.getByRole('textbox')
    await element.click()
    const editor = await getEditorHandle(element)
    await editor.evaluate((editor, example) => {
      const paragraph = { type: 'paragraph', children: [{ text: 'abc' }] }
      const block =
        example === 'tables'
          ? {
              type: 'table',
              children: [
                {
                  type: 'table-row',
                  children: [
                    { type: 'table-cell', children: [{ text: 'abc' }] },
                  ],
                },
              ],
            }
          : example === 'richtext'
          ? {
              type: 'bulleted-list',
              children: [{ type: 'list-item', children: [{ text: 'abc' }] }],
            }
          : example === 'mentions'
          ? {
              type: 'paragraph',
              children: [
                { text: '' },
                {
                  type: 'mention',
                  character: 'R2-D2',
                  children: [{ text: '' }],
                },
                { text: 'abc' },
              ],
            }
          : paragraph
      editor.withoutNormalizing(() => {
        while (editor.children.length > 0) editor.removeNodes({ at: [0] })
        editor.insertNodes(block, { at: [0] })
        editor.select(editor.end([]))
      })
    }, example)
    await expect(element).toContainText('abc')
    const before = await element.evaluate(
      () => window.getSelection()!.getRangeAt(0).getBoundingClientRect().top
    )
    await editor.evaluate(editor => editor.insertText('\n'))
    if (browserName === 'firefox') {
      await expect
        .poll(() =>
          element.evaluate(
            () =>
              window.getSelection()!.getRangeAt(0).getBoundingClientRect().top
          )
        )
        .toBeGreaterThan(before + 5)
    }
    await page.keyboard.type('XYZ')
    await expect
      .poll(() => editor.evaluate(editor => editor.string([])))
      .toBe('abc\nXYZ')
    await page.keyboard.press('Backspace')
    await expect
      .poll(() => editor.evaluate(editor => editor.string([])))
      .toBe('abc\nXY')
    expect(errors).toEqual([])
    await editor.dispose()
  })
}
