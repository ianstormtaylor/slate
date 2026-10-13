import { test, expect, Page } from '@playwright/test'
import type { Point } from 'slate'
import { getEditorHandle } from '../support/editor'

const paragraph = (text: string) => ({
  type: 'paragraph',
  children: [{ text }],
})

const setup = async (page: Page, texts: string[]) => {
  await page.goto('http://localhost:3000/examples/richtext')
  const element = page.getByRole('textbox')
  await element.click()
  const editor = await getEditorHandle(element)
  await editor.evaluate((editor, children) => {
    editor.withoutNormalizing(() => {
      for (let i = editor.children.length - 1; i >= 0; i--) {
        editor.removeNodes({ at: [i] })
      }
      editor.insertNodes(children, { at: [0] })
    })
  }, texts.map(paragraph))
  return editor
}

const pressFrom = async (
  page: Page,
  editor: Awaited<ReturnType<typeof setup>>,
  point: Point,
  key: string
) => {
  await editor.evaluate((editor, point) => editor.select(point), point)
  await page.waitForFunction(() => {
    const selection = window.getSelection()
    return !!selection?.anchorNode && selection.isCollapsed
  })
  await page.waitForTimeout(150)
  await page.keyboard.press(key)
  await page.waitForTimeout(50)
  return editor.evaluate(editor => editor.selection)
}

test.describe('ArrowUp into a block that ends with a newline', () => {
  test.beforeEach(({}, info) => {
    test.skip(
      info.project.name === 'mobile',
      'Hardware arrow keys on desktop browsers'
    )
  })

  test('moves from the start of the next block to the empty last line', async ({
    page,
  }) => {
    const editor = await setup(page, ['AAA', 'BBB\n', 'CCC'])
    const selection = await pressFrom(
      page,
      editor,
      { path: [2, 0], offset: 0 },
      'ArrowUp'
    )
    expect(selection?.focus).toEqual({ path: [1, 0], offset: 4 })
    expect(selection?.anchor).toEqual({ path: [1, 0], offset: 4 })
  })

  test('moves from the middle of the next block', async ({ page }) => {
    const editor = await setup(page, ['AAA', 'BBB\n', 'CCC'])
    const selection = await pressFrom(
      page,
      editor,
      { path: [2, 0], offset: 2 },
      'ArrowUp'
    )
    expect(selection?.focus).toEqual({ path: [1, 0], offset: 4 })
  })

  test('extends the selection with Shift', async ({ page }) => {
    const editor = await setup(page, ['AAA', 'BBB\n', 'CCC'])
    const selection = await pressFrom(
      page,
      editor,
      { path: [2, 0], offset: 0 },
      'Shift+ArrowUp'
    )
    expect(selection).toEqual({
      anchor: { path: [2, 0], offset: 0 },
      focus: { path: [1, 0], offset: 4 },
    })
  })

  test('types on the empty last line after moving there', async ({ page }) => {
    const editor = await setup(page, ['AAA', 'BBB\n', 'CCC'])
    await pressFrom(page, editor, { path: [2, 0], offset: 0 }, 'ArrowUp')
    await page.keyboard.type('x')
    expect(
      await editor.evaluate(editor =>
        editor.children.map((_, i) => editor.string([i]))
      )
    ).toEqual(['AAA', 'BBB\nx', 'CCC'])
  })

  test('leaves other blocks to the browser', async ({ page }) => {
    const editor = await setup(page, ['AAA', 'BBB', 'CCC'])
    const selection = await pressFrom(
      page,
      editor,
      { path: [2, 0], offset: 0 },
      'ArrowUp'
    )
    expect(selection?.focus.path).toEqual([1, 0])
  })
})
