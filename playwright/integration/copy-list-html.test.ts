import { test, expect } from '@playwright/test'
import type { DOMEditor } from 'slate-dom'
import { getEditorHandle } from './support/editor'

for (const [type, tag] of [
  ['numbered-list', 'ol'],
  ['bulleted-list', 'ul'],
]) {
  test(`copying a whole ${type} keeps its HTML wrapper`, async ({ page }) => {
    await page.goto('/examples/richtext')
    const element = page.getByRole('textbox')
    const editor = await getEditorHandle(element)
    await editor.evaluate((editor, type) => {
      const list = {
        type,
        children: [
          { type: 'list-item', children: [{ text: 'one' }] },
          { type: 'list-item', children: [{ text: 'two' }] },
        ],
      }
      editor.withoutNormalizing(() => {
        while (editor.children.length) editor.removeNodes({ at: [0] })
        editor.insertNodes(list, { at: [0] })
      })
      editor.select({ anchor: editor.start([]), focus: editor.end([]) })
    }, type)
    await expect(element.locator(`${tag} > li`)).toHaveText(['one', 'two'])
    const copied = await editor.evaluate(editor => {
      const data = new DataTransfer()
      ;(editor as DOMEditor).setFragmentData(data)
      const html = new DOMParser().parseFromString(
        data.getData('text/html'),
        'text/html'
      )
      return {
        tags: Array.from(html.body.children, node => node.tagName),
        items: Array.from(
          html.querySelectorAll('li'),
          node => node.textContent
        ),
        fragment: data.getData('application/x-slate-fragment'),
      }
    })
    expect(copied.tags).toEqual([tag.toUpperCase()])
    expect(copied.items).toEqual(['one', 'two'])
    expect(copied.fragment).not.toBe('')
    await editor.dispose()
  })

  for (const [start, text] of [
    [1, 'wo'],
    [0, 'two'],
  ] as const) {
    test(`copying ${text} within one ${type} item does not add a list`, async ({
      page,
    }) => {
      await page.goto('/examples/richtext')
      const element = page.getByRole('textbox')
      const editor = await getEditorHandle(element)
      await editor.evaluate(
        (editor, { type, start }) => {
          const list = {
            type,
            children: [
              { type: 'list-item', children: [{ text: 'one' }] },
              { type: 'list-item', children: [{ text: 'two' }] },
            ],
          }
          editor.withoutNormalizing(() => {
            while (editor.children.length) editor.removeNodes({ at: [0] })
            editor.insertNodes(list, { at: [0] })
          })
          editor.select({
            anchor: { path: [0, 1, 0], offset: start },
            focus: { path: [0, 1, 0], offset: 3 },
          })
        },
        { type, start }
      )
      await expect(element.locator(`${tag} > li`)).toHaveText(['one', 'two'])
      const copied = await editor.evaluate(editor => {
        const data = new DataTransfer()
        ;(editor as DOMEditor).setFragmentData(data)
        const html = new DOMParser().parseFromString(
          data.getData('text/html'),
          'text/html'
        )
        return {
          listTags: html.querySelectorAll('ol, ul, li').length,
          text: html.body.textContent,
          plain: data.getData('text/plain'),
        }
      })
      expect(copied).toEqual({ listTags: 0, text, plain: text })
      await editor.dispose()
    })
  }
}
