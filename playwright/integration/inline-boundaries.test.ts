import { expect, test } from '@playwright/test'
import { getEditorHandle } from './support/editor'

for (const layout of ['document', 'nested', 'following paragraph']) {
  for (const reverse of [true, false]) {
    test(`moves ${
      reverse ? 'before' : 'after'
    } a padded inline in ${layout}`, async ({ page }) => {
      await page.goto('/playwright/inline-boundaries')
      const element = page.getByRole('textbox')
      await element.click()
      const editor = await getEditorHandle(element)
      const blockPath =
        layout === 'nested'
          ? [0, 0]
          : layout === 'following paragraph'
          ? [1]
          : [0]
      await editor.evaluate(
        (editor, { layout, blockPath, reverse }) => {
          const paragraph = {
            type: layout === 'nested' ? 'list-item' : 'paragraph',
            children: [
              { text: '' },
              { type: 'link', url: '#', children: [{ text: 'link' }] },
              { text: '' },
            ],
          }
          const blocks =
            layout === 'nested'
              ? [{ type: 'bulleted-list', children: [paragraph] }]
              : layout === 'following paragraph'
              ? [
                  { type: 'paragraph', children: [{ text: 'before' }] },
                  paragraph,
                ]
              : [paragraph]
          editor.withoutNormalizing(() => {
            while (editor.children.length) editor.removeNodes({ at: [0] })
            editor.insertNodes(blocks, { at: [0] })
            editor.select({
              path: [...blockPath, 1, 0],
              offset: reverse ? 0 : 4,
            })
          })
        },
        { layout, blockPath, reverse }
      )
      await expect
        .poll(() =>
          page.evaluate(() => ({
            text: window.getSelection()?.anchorNode?.textContent,
            offset: window.getSelection()?.anchorOffset,
          }))
        )
        .toEqual({ text: 'link', offset: reverse ? 0 : 4 })
      await page.keyboard.press(reverse ? 'ArrowLeft' : 'ArrowRight')
      await expect
        .poll(() =>
          element.evaluate((element, reverse) => {
            const caret = window
              .getSelection()!
              .getRangeAt(0)
              .getBoundingClientRect()
            const inline = element
              .querySelector('[data-slate-inline]')!
              .getBoundingClientRect()
            return (
              Math.abs(caret.left - (reverse ? inline.left : inline.right)) +
              Math.abs(caret.top - inline.top)
            )
          }, reverse)
        )
        .toBeLessThan(1)
      const point = { path: [...blockPath, reverse ? 0 : 2], offset: 0 }
      await expect
        .poll(() => editor.evaluate(editor => editor.selection))
        .toEqual({ anchor: point, focus: point })
      await page.keyboard.type('Z')
      await expect
        .poll(() =>
          editor.evaluate(
            (editor, blockPath) => editor.node(blockPath)[0],
            blockPath
          )
        )
        .toEqual({
          type: layout === 'nested' ? 'list-item' : 'paragraph',
          children: [
            { text: reverse ? 'Z' : '' },
            { type: 'link', url: '#', children: [{ text: 'link' }] },
            { text: reverse ? '' : 'Z' },
          ],
        })
      await editor.dispose()
    })
  }
}

test('character movement inside an inline keeps an emoji grapheme intact', async ({
  page,
}) => {
  await page.goto('/playwright/inline-boundaries')
  const element = page.getByRole('textbox')
  await element.click()
  const editor = await getEditorHandle(element)
  await editor.evaluate(editor => {
    editor.select({ path: [0, 1, 0], offset: 0 })
    editor.insertText('👩‍👩‍👧‍👦')
  })
  await expect
    .poll(() => page.evaluate(() => window.getSelection()?.anchorOffset))
    .toBe(11)
  await page.keyboard.press('ArrowLeft')
  await expect
    .poll(() => editor.evaluate(editor => editor.selection?.anchor.offset))
    .toBe(0)
  await page.keyboard.press('ArrowRight')
  await expect
    .poll(() => editor.evaluate(editor => editor.selection?.anchor.offset))
    .toBe(11)
  await editor.dispose()
})

for (const reverse of [true, false]) {
  test(`leaves a padded RTL inline ${
    reverse ? 'backward' : 'forward'
  }`, async ({ page }) => {
    await page.goto('/playwright/inline-boundaries')
    const element = page.getByRole('textbox')
    await element.click()
    const editor = await getEditorHandle(element)
    await editor.evaluate((editor, reverse) => {
      editor.select({
        anchor: { path: [0, 1, 0], offset: 0 },
        focus: { path: [0, 1, 0], offset: 4 },
      })
      editor.insertText('שלום')
      editor.select({ path: [0, 1, 0], offset: reverse ? 0 : 4 })
    }, reverse)
    await expect(element.locator('[dir=rtl]')).toHaveCount(1)
    await expect
      .poll(() => page.evaluate(() => window.getSelection()?.anchorOffset))
      .toBe(reverse ? 0 : 4)
    await page.keyboard.press(reverse ? 'ArrowRight' : 'ArrowLeft')
    const point = { path: [0, reverse ? 0 : 2], offset: 0 }
    await expect
      .poll(() => editor.evaluate(editor => editor.selection))
      .toEqual({ anchor: point, focus: point })
    await expect
      .poll(() =>
        element.evaluate((element, reverse) => {
          const caret = window
            .getSelection()!
            .getRangeAt(0)
            .getBoundingClientRect()
          const inline = element
            .querySelector('[data-slate-inline]')!
            .getBoundingClientRect()
          return Math.abs(caret.left - (reverse ? inline.right : inline.left))
        }, reverse)
      )
      .toBeLessThan(1)
    await page.keyboard.type('Z')
    await expect
      .poll(() =>
        editor.evaluate(
          (editor, reverse) => editor.string([0, reverse ? 0 : 2]),
          reverse
        )
      )
      .toBe('Z')
    await expect
      .poll(() => editor.evaluate(editor => editor.string([0, 1])))
      .toBe('שלום')
    await editor.dispose()
  })
}
