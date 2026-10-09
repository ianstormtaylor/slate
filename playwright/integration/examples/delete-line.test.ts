import { test, expect, Locator } from '@playwright/test'
import { clearEditor, getEditorHandle } from '../support/editor'

const deleteLine = (element: Locator) =>
  element.evaluate(element => {
    element.dispatchEvent(
      new InputEvent('beforeinput', {
        inputType: 'deleteSoftLineBackward',
        bubbles: true,
        cancelable: true,
      })
    )
  })

test.describe('delete backward by line', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name === 'mobile',
      'Synthetic beforeinput does not simulate a soft keyboard'
    )
    await page.goto('http://localhost:3000/examples/richtext')
  })

  for (const text of ['', 'next']) {
    test(`merges a ${
      text ? 'non-empty' : 'blank'
    } paragraph at its start`, async ({ page }) => {
      const element = page.getByRole('textbox')
      await clearEditor(element)
      const editor = await getEditorHandle(element)
      await editor.evaluate((editor, text) => {
        editor.insertText('previous')
        const paragraph = { type: 'paragraph', children: [{ text }] }
        editor.insertNodes(paragraph, { at: [1] })
        editor.select({ path: [1, 0], offset: 0 })
      }, text)
      await expect(element.locator('p')).toHaveCount(2)
      await deleteLine(element)
      await expect(element.locator('p')).toHaveText([`previous${text}`])
      expect(await editor.evaluate(editor => editor.selection)).toEqual({
        anchor: { path: [0, 0], offset: 8 },
        focus: { path: [0, 0], offset: 8 },
      })
      await editor.dispose()
    })
  }

  test('deletes only the text before the caret on the current line', async ({
    page,
  }) => {
    const element = page.getByRole('textbox')
    await clearEditor(element)
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.insertText('first second')
      editor.select({ path: [0, 0], offset: 6 })
    })
    await expect(element).toHaveText('first second')
    await deleteLine(element)
    await expect(element).toHaveText('second')
    await editor.dispose()
  })

  test('leaves the document start unchanged', async ({ page }) => {
    const element = page.getByRole('textbox')
    await clearEditor(element)
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.insertText('first')
      editor.select({ path: [0, 0], offset: 0 })
    })
    await expect(element).toHaveText('first')
    await deleteLine(element)
    await expect(element).toHaveText('first')
    await editor.dispose()
  })

  test('deletes one character at a soft-wrapped line start', async ({
    page,
  }) => {
    const element = page.getByRole('textbox')
    await clearEditor(element)
    const editor = await getEditorHandle(element)
    const text = 'one two three four'
    await editor.evaluate((editor, text) => editor.insertText(text), text)
    await expect(element).toHaveText(text)
    const offset = await element.evaluate(element => {
      element.style.width = '90px'
      element.style.fontFamily = 'monospace'
      element.style.fontSize = '16px'
      const text = element.querySelector('[data-slate-string]')!.firstChild!
      const range = document.createRange()
      range.setStart(text, 0)
      range.collapse(true)
      const top = range.getBoundingClientRect().top
      for (let offset = 1; offset < text.textContent!.length; offset++) {
        range.setStart(text, offset)
        range.collapse(true)
        if (range.getBoundingClientRect().top > top) return offset
      }
      throw new Error('The text did not wrap')
    })
    await editor.evaluate(
      (editor, offset) => editor.select({ path: [0, 0], offset }),
      offset
    )
    await deleteLine(element)
    await expect(element).toHaveText(
      text.slice(0, offset - 1) + text.slice(offset)
    )
    await editor.dispose()
  })

  test('preserves table cell boundaries', async ({ page }) => {
    await page.goto('http://localhost:3000/examples/tables')
    const element = page.getByRole('textbox')
    await element.click()
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => editor.select(editor.start([1, 1, 1])))
    const before = await editor.evaluate(editor => editor.children)
    await deleteLine(element)
    expect(await editor.evaluate(editor => editor.children)).toEqual(before)
    await editor.dispose()
  })

  test('merges empty list items without removing the list', async ({
    page,
  }) => {
    const element = page.getByRole('textbox')
    await clearEditor(element)
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.withoutNormalizing(() => {
        editor.removeNodes({ at: [0] })
        const list = {
          type: 'bulleted-list',
          children: [
            { type: 'list-item', children: [{ text: 'one' }] },
            { type: 'list-item', children: [{ text: '' }] },
          ],
        }
        editor.insertNodes(list, { at: [0] })
        editor.select({ path: [0, 1, 0], offset: 0 })
      })
    })
    await expect(element.locator('li')).toHaveCount(2)
    await deleteLine(element)
    await expect(element.locator('ul')).toHaveCount(1)
    await expect(element.locator('li')).toHaveText(['one'])
    await editor.dispose()
  })

  test('preserves a preceding void when removing an empty block', async ({
    page,
  }) => {
    await page.goto('http://localhost:3000/examples/images')
    const element = page.getByRole('textbox')
    await clearEditor(element)
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      const image = {
        type: 'image',
        url: '/logo.svg',
        children: [{ text: '' }],
      }
      editor.insertNodes(image, { at: [0] })
      editor.select({ path: [1, 0], offset: 0 })
    })
    await expect(element.locator('[data-slate-void]')).toHaveCount(1)
    await deleteLine(element)
    await expect
      .poll(() => editor.evaluate(editor => editor.children.length))
      .toBe(1)
    await expect(element.locator('[data-slate-void]')).toHaveCount(1)
    expect(await editor.evaluate(editor => editor.selection)).toEqual({
      anchor: { path: [0, 0], offset: 0 },
      focus: { path: [0, 0], offset: 0 },
    })
    await editor.dispose()
  })
})
