import { test, expect } from '@playwright/test'
import { getEditorHandle } from '../support/editor'

test.describe('composing after toggling a mark on Android', () => {
  test('keeps the whole composed word in the new mark', async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== 'mobile',
      'Uses the Android input path and the Chromium DevTools protocol'
    )
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('http://localhost:3000/examples/richtext')
    const element = page.getByRole('textbox')
    await element.click()

    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.select({ path: [0, 0], offset: 'This is '.length })
      editor.addMark('bold', true)
    })

    const cdp = await page.context().newCDPSession(page)
    for (const text of ['b', 'bo', 'bol', 'bold']) {
      await cdp.send('Input.imeSetComposition', {
        text,
        selectionStart: text.length,
        selectionEnd: text.length,
      })
      await page.waitForTimeout(50)
    }
    await cdp.send('Input.insertText', { text: 'bold' })

    await expect
      .poll(() =>
        editor.evaluate(editor =>
          editor.children[0].children
            .filter(leaf => leaf.bold)
            .map(leaf => leaf.text)
        )
      )
      .toEqual(['bold', 'rich'])
    await expect(
      element.locator('[data-slate-node="element"]').first()
    ).toHaveText(
      'This is boldeditable rich text, much better than a <textarea>!'
    )
    expect(errors).toEqual([])
    await editor.dispose()
  })

  test('keeps committed letters together in the new mark', async ({
    page,
  }, info) => {
    test.skip(
      info.project.name !== 'mobile',
      'Uses the Android input path and the Chromium DevTools protocol'
    )
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('http://localhost:3000/examples/richtext')
    const element = page.getByRole('textbox')
    await element.click()

    const editor = await getEditorHandle(element)
    await editor.evaluate(editor => {
      editor.select({ path: [0, 0], offset: 'This is '.length })
      editor.addMark('bold', true)
    })

    const cdp = await page.context().newCDPSession(page)
    for (const letter of 'bold') {
      await cdp.send('Input.insertText', { text: letter })
      await page.waitForTimeout(100)
    }

    await expect
      .poll(() =>
        editor.evaluate(editor =>
          editor.children[0].children
            .filter(leaf => leaf.bold)
            .map(leaf => leaf.text)
        )
      )
      .toEqual(['bold', 'rich'])
    expect(await editor.evaluate(editor => editor.selection)).toEqual({
      anchor: { path: [0, 1], offset: 4 },
      focus: { path: [0, 1], offset: 4 },
    })
    expect(errors).toEqual([])
    await editor.dispose()
  })
})
