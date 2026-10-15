import { test, expect, Locator } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

const placeCaret = async (textbox: Locator, leaf: number, offset: number) => {
  await textbox.click()
  const editor = await getEditorHandle(textbox)
  const slateOffset = leaf * 3 + offset
  await editor.evaluate((editor, offset) => {
    editor.select({ path: [0, 0], offset })
  }, slateOffset)
  await expect
    .poll(() =>
      textbox.evaluate(element => {
        const selection = window.getSelection()!
        const range = document.createRange()
        range.selectNodeContents(element)
        range.setEnd(selection.anchorNode!, selection.anchorOffset)
        return range.toString().length
      })
    )
    .toBe(slateOffset)
  await textbox
    .locator('[data-slate-string]')
    .nth(leaf)
    .evaluate((element, offset) => {
      const node = element.firstChild!
      window.getSelection()!.setBaseAndExtent(node, offset, node, offset)
    }, offset)
  return editor
}

test.describe('native insertText overrides', () => {
  test.skip(({ isMobile }) => isMobile, 'Android uses a separate input manager')

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/examples/insert-text-noop')
  })

  for (const { name, leaf, offset, expected } of [
    { name: 'inside the highlight', leaf: 0, offset: 2, expected: 'abgcdef' },
    {
      name: 'at the end of the highlight',
      leaf: 0,
      offset: 3,
      expected: 'abcgdef',
    },
    {
      name: 'at the start of the undecorated leaf',
      leaf: 1,
      offset: 0,
      expected: 'abcgdef',
    },
    {
      name: 'at the end of the undecorated leaf',
      leaf: 1,
      offset: 3,
      expected: 'abcdefg',
    },
  ]) {
    test(`ignores blocked text ${name} and keeps the caret`, async ({
      page,
    }) => {
      const textbox = page.getByRole('textbox')
      const editor = await placeCaret(textbox, leaf, offset)
      await textbox.pressSequentially('X')
      await expect(textbox).toHaveText('abcdef')
      expect(await editor.evaluate(e => e.string([]))).toBe('abcdef')
      await textbox.pressSequentially('g')
      await expect(textbox).toHaveText(expected)
      expect(await editor.evaluate(e => e.string([]))).toBe(expected)
      await editor.dispose()
    })
  }

  for (const { input, expected } of [
    { input: 'XYZ', expected: 'abcdef' },
    { input: 'XgYhZi', expected: 'abcdefghi' },
  ]) {
    test(`keeps the DOM and model aligned after ${input}`, async ({ page }) => {
      const textbox = page.getByRole('textbox')
      const editor = await placeCaret(textbox, 1, 3)
      await textbox.pressSequentially(input)
      await expect(textbox).toHaveText(expected)
      expect(await editor.evaluate(e => e.string([]))).toBe(expected)
      await editor.dispose()
    })
  }

  test('preserves a replacement character inserted by an override', async ({
    page,
  }) => {
    const textbox = page.getByRole('textbox')
    const editor = await placeCaret(textbox, 1, 0)
    await editor.evaluate(editor => {
      const insertText = editor.insertText
      editor.insertText = (text, options) =>
        insertText(text.toLowerCase(), options)
    })
    await textbox.pressSequentially('X')
    await expect(textbox).toHaveText('abcxdef')
    expect(await editor.evaluate(e => e.string([]))).toBe('abcxdef')
    await editor.dispose()
  })

  test('preserves an insertion redirected to a different position', async ({
    page,
  }) => {
    const textbox = page.getByRole('textbox')
    const editor = await placeCaret(textbox, 1, 0)
    await editor.evaluate(editor => {
      const insertText = editor.insertText
      editor.insertText = (text, options) => {
        editor.select(editor.start([]))
        insertText(text.toLowerCase(), options)
      }
    })
    await textbox.pressSequentially('X')
    await expect(textbox).toHaveText('xabcdef')
    expect(await editor.evaluate(e => e.string([]))).toBe('xabcdef')
    await editor.dispose()
  })
})
