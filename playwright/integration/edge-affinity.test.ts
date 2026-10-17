import { expect, test } from '@playwright/test'
import { getEditorHandle } from './support/editor'

for (const type of ['link', 'button']) {
  test(`outside affinity keeps typing outside an inline ${type}`, async ({
    page,
  }) => {
    await page.goto('/examples/inlines')
    const element = page.getByRole('textbox')
    await element.click()
    const editor = await getEditorHandle(element)
    const path = await editor.evaluate((editor, type) => {
      editor.inlineEdgeAffinity = element =>
        element.type === type ? 'outside' : null
      const block = editor.children[0]
      if (!('children' in block)) throw new Error('Expected paragraph')
      const index = block.children.findIndex(
        node => 'type' in node && node.type === type
      )
      const path = [0, index]
      editor.select(editor.end(path))
      return path
    }, type)
    await page.keyboard.type('x')
    await expect
      .poll(() =>
        editor.evaluate((editor, path) => {
          return editor.string(path).endsWith('x')
        }, path)
      )
      .toBe(false)
    await expect
      .poll(() =>
        editor.evaluate(
          (editor, path) => editor.string([0]).includes('x'),
          path
        )
      )
      .toBe(true)
    const after = await editor.evaluate((editor, path) => {
      const [node] = editor.node([0, path[1] + 1])
      return 'text' in node ? node.text : null
    }, path)
    expect(after).toMatch(/^x/)
  })
}

test('toolbar marks agree with text inserted at a bold boundary', async ({
  page,
}) => {
  await page.goto('/examples/richtext')
  const element = page.getByRole('textbox')
  await element.click()
  const editor = await getEditorHandle(element)
  const marks = await editor.evaluate(editor => {
    editor.leafEdgeAffinity = () => 'backward'
    editor.withoutNormalizing(() => {
      for (let i = editor.children.length - 1; i >= 0; i--) {
        editor.apply({
          type: 'remove_node',
          path: [i],
          node: editor.children[i],
        })
      }
      editor.apply({
        type: 'insert_node',
        path: [0],
        node: {
          type: 'paragraph',
          children: [{ text: 'bold', bold: true }, { text: 'plain' }],
        },
      })
      editor.select({ path: [0, 1], offset: 0 })
    })
    return editor.getMarks()
  })
  expect(marks).toEqual({ bold: true })
  await editor.evaluate(editor => {
    if (editor.selection?.anchor.path.join() !== '0,1')
      throw new Error('Expected the plain leaf boundary')
    editor.insertText('x')
  })
  await expect(element.locator('strong')).toHaveText('boldx')
  await expect
    .poll(() => editor.evaluate(editor => editor.getMarks()))
    .toEqual({ bold: true })
})

test('forward affinity exits a code mark when typing at its end', async ({
  page,
}) => {
  await page.goto('/examples/richtext')
  const element = page.getByRole('textbox')
  await element.click()
  const editor = await getEditorHandle(element)
  await editor.evaluate(editor => {
    editor.leafEdgeAffinity = (before, after) =>
      before.code && !after.code ? 'forward' : null
    editor.withoutNormalizing(() => {
      for (let i = editor.children.length - 1; i >= 0; i--) {
        editor.apply({
          type: 'remove_node',
          path: [i],
          node: editor.children[i],
        })
      }
      editor.apply({
        type: 'insert_node',
        path: [0],
        node: {
          type: 'paragraph',
          children: [{ text: 'code', code: true }, { text: ' plain' }],
        },
      })
      editor.select({ path: [0, 0], offset: 4 })
    })
  })
  await page.keyboard.type('x')
  await expect(element.locator('code')).toHaveText('code')
  await expect(element).toHaveText('codex plain')
  await expect
    .poll(() => editor.evaluate(editor => editor.getMarks()))
    .toEqual({})
})
