import { test, expect, Page } from '@playwright/test'
import type { Range } from 'slate'
import { getEditorHandle } from '../support/editor'

const readModel = async (page: Page) => {
  const editor = await getEditorHandle(page.getByRole('textbox'))
  const model = await editor.evaluate(editor => ({
    blocks: editor.children.length,
    text: editor.string([]),
  }))
  await editor.dispose()
  return model
}

const selectInModel = async (page: Page, range: Range) => {
  const editor = await getEditorHandle(page.getByRole('textbox'))
  await editor.evaluate((editor, range) => editor.select(range), range)
  await editor.dispose()
}

const openRichtext = async (page: Page) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('http://localhost:3000/examples/richtext')
  return errors
}

test.describe('replacing an expanded selection with composed text', () => {
  test('replaces every block selected with select all', async ({ page }) => {
    const errors = await openRichtext(page)
    const element = page.getByRole('textbox')
    await element.press('ControlOrMeta+A')
    await page.keyboard.insertText('abc')

    await expect(element).toHaveText('abc')
    expect(await readModel(page)).toEqual({ blocks: 1, text: 'abc' })

    await page.keyboard.type('d')
    await element.press('Enter')
    await page.keyboard.type('e')

    await expect(element.locator('[data-slate-node="element"]')).toHaveText([
      'abcd',
      'e',
    ])
    expect(await readModel(page)).toEqual({ blocks: 2, text: 'abcde' })
    expect(errors).toEqual([])
  })

  test('replaces a selection across marked text in one block', async ({
    page,
  }) => {
    const errors = await openRichtext(page)
    const element = page.getByRole('textbox')
    await element.click()
    await selectInModel(page, {
      anchor: { path: [0, 0], offset: 8 },
      focus: { path: [0, 2], offset: 5 },
    })
    await page.keyboard.insertText('XYZ')

    const firstBlock = element.locator('[data-slate-node="element"]').first()
    await expect(firstBlock).toHaveText(
      'This is XYZ, much better than a <textarea>!'
    )
    expect((await readModel(page)).text).toContain(
      'This is XYZ, much better than a <textarea>!'
    )
    expect(errors).toEqual([])
  })

  test('replaces every block with an IME composition', async ({
    page,
    browserName,
  }, info) => {
    test.skip(
      browserName !== 'chromium' || info.project.name === 'mobile',
      'Drives the IME through the Chromium DevTools protocol'
    )
    const errors = await openRichtext(page)
    const element = page.getByRole('textbox')
    await element.press('ControlOrMeta+A')
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Input.imeSetComposition', {
      text: 'か',
      selectionStart: 1,
      selectionEnd: 1,
    })
    await cdp.send('Input.imeSetComposition', {
      text: 'かな',
      selectionStart: 2,
      selectionEnd: 2,
    })
    await cdp.send('Input.insertText', { text: 'かな' })

    await expect(element).toHaveText('かな')
    expect(await readModel(page)).toEqual({ blocks: 1, text: 'かな' })
    expect(errors).toEqual([])
  })
})
