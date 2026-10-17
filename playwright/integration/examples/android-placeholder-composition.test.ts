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
    await page.goto('/examples/plaintext')
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

  test('keeps composing text after Android deletes the zero-width text node', async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== 'mobile',
      'Replays Android deletion ordering before composing through Chromium DevTools'
    )
    await page.goto('/examples/richtext')
    const element = page.getByRole('textbox')
    await element.click()
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.select([])
      editor.deleteFragment()
    })
    await expect(element.locator('[data-slate-placeholder]')).toBeVisible()

    await element.evaluate(async element => {
      const zeroWidth = element.querySelector('[data-slate-zero-width]')!
      const text = zeroWidth.firstChild!
      const selection = document.getSelection()!
      selection.collapse(text, 1)
      const range = document.createRange()
      range.setStart(text, 0)
      range.setEnd(text, 1)
      const beforeInput = new InputEvent('beforeinput', {
        bubbles: true,
        inputType: 'deleteContentBackward',
      })
      Object.defineProperty(beforeInput, 'getTargetRanges', {
        value: () => [range],
      })
      element.dispatchEvent(beforeInput)
      text.remove()
      selection.collapse(zeroWidth, 0)
      await Promise.resolve()
      element.dispatchEvent(
        new InputEvent('input', {
          bubbles: true,
          inputType: 'deleteContentBackward',
        })
      )
    })

    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Input.imeSetComposition', {
      text: 'a',
      selectionStart: 1,
      selectionEnd: 1,
    })
    await editor.evaluate(async editor => {
      editor.onChange()
      await new Promise<void>(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
    })
    const strings = await element
      .locator('[data-slate-zero-width], [data-slate-string]')
      .allTextContents()
    expect(strings.join('').replace(/\uFEFF/g, '')).toBe('a')

    await cdp.send('Input.insertText', { text: 'a' })
    await expect
      .poll(() => editor.evaluate(editor => editor.string([])))
      .toBe('a')
    await editor.dispose()
  })
})
