import { test, expect } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

test.describe('formatting a block while composing on Android', () => {
  test('keeps text composed into a new paragraph when its type changes', async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== 'mobile',
      'Uses the Android input path and the Chromium DevTools protocol'
    )
    await page.goto('http://localhost:3000/examples/richtext')
    const element = page.getByRole('textbox')
    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.withoutNormalizing(() => {
        while (editor.children.length) editor.removeNodes({ at: [0] })
        editor.insertNodes(
          [
            { type: 'paragraph', children: [{ text: '' }] },
            { type: 'paragraph', children: [{ text: 'existing' }] },
          ],
          { at: [0] }
        )
      })
    })
    await expect(element.locator('p')).toHaveCount(2)
    await element.locator('p').first().click()
    await editor.evaluate(editor => editor.select({ path: [0, 0], offset: 0 }))

    const cdp = await page.context().newCDPSession(page)
    for (const text of ['n', 'ne', 'new']) {
      await cdp.send('Input.imeSetComposition', {
        text,
        selectionStart: text.length,
        selectionEnd: text.length,
      })
    }
    await expect(element.locator('p').first()).toHaveText('new')

    const textAfterFormat = await editor.evaluate(editor => {
      editor.setNodes({ type: 'heading-one' }, { at: [0] })
      return editor.string([0])
    })
    expect(textAfterFormat).toBe('new')
    await expect(element.locator('h1')).toHaveText('new')
    await expect
      .poll(() => editor.evaluate(editor => editor.children))
      .toEqual([
        { type: 'heading-one', children: [{ text: 'new' }] },
        { type: 'paragraph', children: [{ text: 'existing' }] },
      ])

    await cdp.send('Input.imeSetComposition', {
      text: 's',
      selectionStart: 1,
      selectionEnd: 1,
    })
    await cdp.send('Input.insertText', { text: 's' })
    await expect(element.locator('h1')).toHaveText('news')
    await expect
      .poll(() => editor.evaluate(editor => editor.string([0])))
      .toBe('news')
    await editor.dispose()
    await cdp.detach()
  })
})
