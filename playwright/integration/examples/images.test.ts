import { test, expect } from '@playwright/test'
import type { Descendant } from 'slate'
import type { HistoryEditor } from 'slate-history'
import { getEditorHandle } from '../support/editor'

test.describe('images example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/images')
  })

  const image = {
    type: 'image' as const,
    url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    children: [{ text: '' }],
  }
  const followingParagraph = {
    type: 'paragraph',
    children: [{ text: 'following' }],
  }
  const cases: { name: string; following: Descendant[] }[] = [
    { name: 'only image', following: [] },
    {
      name: 'image followed by text',
      following: [followingParagraph],
    },
    {
      name: 'adjacent images',
      following: [{ ...image, children: [{ text: '' }] }],
    },
  ]

  for (const scenario of cases) {
    test(`Enter after ${scenario.name} creates an editable paragraph`, async ({
      page,
    }) => {
      const element = page.getByRole('textbox')
      const editor = await getEditorHandle(element)
      const before = [image, ...scenario.following]
      await element.focus()
      await editor.evaluate((editor, value) => {
        editor.children = value
        editor.select({ path: [0, 0], offset: 0 })
        ;(editor as HistoryEditor).history = { undos: [], redos: [] }
        editor.onChange()
      }, before)
      await expect
        .poll(() => editor.evaluate(editor => editor.selection?.anchor))
        .toEqual({ path: [0, 0], offset: 0 })
      await expect(element.locator('img')).toHaveCount(
        scenario.name === 'adjacent images' ? 2 : 1
      )
      await page.waitForTimeout(200)
      await page.keyboard.press('Enter')
      const after = [
        image,
        { type: 'paragraph', children: [{ text: '' }] },
        ...scenario.following,
      ]
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual(after)
      await expect
        .poll(() => editor.evaluate(editor => editor.selection?.anchor))
        .toEqual({ path: [1, 0], offset: 0 })
      await expect
        .poll(() =>
          element.evaluate(element => {
            const anchor = window.getSelection()!.anchorNode
            return element.querySelector('p')?.contains(anchor)
          })
        )
        .toBe(true)
      await page.keyboard.type('after', { delay: 120 })
      await expect(element.locator('p').first()).toHaveText('after')
      await expect
        .poll(() => editor.evaluate(editor => editor.string([1])))
        .toBe('after')
      const typed = await editor.evaluate(editor => editor.children)
      await editor.evaluate(editor => (editor as HistoryEditor).undo())
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual(after)
      await editor.evaluate(editor => (editor as HistoryEditor).undo())
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual(before)
      await editor.evaluate(editor => (editor as HistoryEditor).redo())
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual(after)
      await editor.evaluate(editor => (editor as HistoryEditor).redo())
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual(typed)
      await editor.dispose()
    })
  }

  test('Enter in ordinary text keeps its existing split behavior', async ({
    page,
  }) => {
    const element = page.getByRole('textbox')
    const editor = await getEditorHandle(element)
    await element.focus()
    await editor.evaluate(editor => {
      const paragraph = { type: 'paragraph', children: [{ text: 'abcd' }] }
      editor.children = [paragraph]
      editor.select({ path: [0, 0], offset: 2 })
      editor.onChange()
    })
    await expect
      .poll(() => page.evaluate(() => window.getSelection()!.anchorOffset))
      .toBe(2)
    await page.keyboard.press('Enter')
    await expect
      .poll(() => editor.evaluate(editor => editor.children))
      .toEqual([
        { type: 'paragraph', children: [{ text: 'ab' }] },
        { type: 'paragraph', children: [{ text: 'cd' }] },
      ])
    await editor.dispose()
  })

  test('contains image', async ({ page }) => {
    await expect(page.getByRole('textbox').locator('img')).toHaveCount(2)
  })
})
