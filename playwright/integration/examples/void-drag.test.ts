import { test, expect } from '@playwright/test'
import type { HistoryEditor } from 'slate-history'
import { getEditorHandle } from '../support/editor'

for (const target of ['padding', 'text', 'self', 'later text']) {
  test(`dragging a block void to ${target} moves it only once`, async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Native image dragging needs a desktop pointer')
    await page.goto('/examples/images')
    const textbox = page.getByRole('textbox')
    const editor = await getEditorHandle(textbox)
    const image = {
      type: 'image',
      url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      children: [{ text: '' }],
    }
    const paragraph = (text: string) => ({
      type: 'paragraph',
      children: [{ text }],
    })
    const before =
      target === 'later text'
        ? [image, paragraph('start'), paragraph('middle'), paragraph('end')]
        : [paragraph('start'), paragraph('middle'), image, paragraph('end')]
    await editor.evaluate((editor, value) => {
      editor.children = value
      editor.deselect()
      ;(editor as HistoryEditor).history = { undos: [], redos: [] }
      editor.onChange()
    }, before)
    await expect(textbox.locator('img')).toHaveCount(1)
    await textbox.evaluate(element => {
      element.style.padding = '40px'
      const image = element.querySelector('img')!
      image.style.width = '100px'
      image.style.height = '70px'
      element.addEventListener(
        'drop',
        () => element.setAttribute('data-dropped', 'true'),
        { once: true }
      )
    })
    const source = (await textbox.locator('img').boundingBox())!
    const destination =
      target === 'padding'
        ? (await textbox.boundingBox())!
        : target === 'self'
        ? { ...source, y: source.y + source.height - 24 }
        : target === 'later text'
        ? (await textbox.locator('p').last().boundingBox())!
        : (await textbox.locator('p').first().boundingBox())!
    await page.mouse.move(source.x + 30, source.y + 30)
    await page.mouse.down()
    await page.mouse.move(source.x + 35, source.y + 35, { steps: 5 })
    const inset = target === 'padding' ? 10 : 1
    await page.mouse.move(destination.x + inset, destination.y + 10, {
      steps: 20,
    })
    await page.mouse.move(destination.x + inset + 1, destination.y + 12, {
      steps: 5,
    })
    await page.mouse.up()
    await expect(textbox).toHaveAttribute('data-dropped', 'true')
    await expect(textbox.locator('img')).toHaveCount(1)
    const after =
      target === 'self'
        ? before
        : target === 'later text'
        ? [paragraph('start'), paragraph('middle'), image, paragraph('end')]
        : [image, paragraph('start'), paragraph('middle'), paragraph('end')]
    await expect
      .poll(() => editor.evaluate(editor => editor.children))
      .toEqual(after)
    if (target !== 'self') {
      await editor.evaluate(editor => (editor as HistoryEditor).undo())
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual(before)
      await editor.evaluate(editor => (editor as HistoryEditor).redo())
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual(after)
    }
    await editor.dispose()
  })
}
