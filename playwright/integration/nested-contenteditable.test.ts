import { test, expect, Locator } from '@playwright/test'
import { getEditorHandle } from './support/editor'

const focusEnd = async (element: Locator) => {
  await element.focus()
  await element.evaluate(element => {
    const range = document.createRange()
    range.selectNodeContents(element)
    range.collapse(false)
    const selection = window.getSelection()!
    selection.removeAllRanges()
    selection.addRange(range)
  })
  await expect
    .poll(() =>
      element.evaluate(element =>
        element.contains(window.getSelection()!.anchorNode)
      )
    )
    .toBe(true)
}

for (const contentEditable of ['true', '', 'plaintext-only']) {
  test(`nested contenteditable=${JSON.stringify(
    contentEditable
  )} keeps typing and selection`, async ({ page }) => {
    await page.goto('/examples/images')
    const outer = page.locator('[data-slate-editor]')
    const editor = await getEditorHandle(outer)
    const before = await editor.evaluate(editor => editor.children)
    await outer
      .locator('[data-slate-void]')
      .first()
      .evaluate((voidElement, value) => {
        const inner = document.createElement('div')
        inner.setAttribute('contenteditable', value)
        inner.setAttribute('data-test-id', 'nested-editor')
        inner.textContent = 'inner'
        voidElement
          .querySelector('[contenteditable="false"]')!
          .appendChild(inner)
      }, contentEditable)
    const inner = page.getByTestId('nested-editor')
    await focusEnd(inner)
    await page.keyboard.type('X')
    await expect(inner).toHaveText('innerX')
    await page.keyboard.press('Backspace')
    await expect(inner).toHaveText('inner')
    await page.keyboard.press('Enter')
    await page.keyboard.type('Y')
    await expect(inner).toContainText('Y')
    expect(await editor.evaluate(editor => editor.children)).toEqual(before)
    await expect
      .poll(() =>
        inner.evaluate(inner =>
          inner.contains(window.getSelection()!.anchorNode)
        )
      )
      .toBe(true)
    await editor.dispose()
  })
}

for (const eventType of ['beforeinput', 'input']) {
  test(`nested ${eventType} history events do not undo the outer editor`, async ({
    page,
  }) => {
    await page.goto('/examples/images')
    const outer = page.locator('[data-slate-editor]')
    const editor = await getEditorHandle(outer)
    await editor.evaluate(editor => {
      editor.select(editor.start([]))
      editor.insertText('outer-change')
    })
    const before = await editor.evaluate(editor => editor.children)
    await outer
      .locator('[data-slate-void]')
      .first()
      .evaluate(voidElement => {
        const inner = document.createElement('div')
        inner.contentEditable = 'true'
        inner.setAttribute('data-test-id', 'nested-editor')
        inner.textContent = 'inner'
        voidElement
          .querySelector('[contenteditable="false"]')!
          .appendChild(inner)
      })
    const inner = page.getByTestId('nested-editor')
    await focusEnd(inner)
    await inner.evaluate((inner, type) => {
      inner.dispatchEvent(
        new InputEvent(type, {
          bubbles: true,
          cancelable: type === 'beforeinput',
          inputType: 'historyUndo',
        })
      )
    }, eventType)
    expect(await editor.evaluate(editor => editor.children)).toEqual(before)
    await editor.dispose()
  })
}
