import { test, expect } from '@playwright/test'
import type { HistoryEditor } from 'slate-history'
import { getEditorHandle } from '../support/editor'

for (const source of ['bulleted-list', 'numbered-list']) {
  for (const destination of ['bulleted-list', 'numbered-list']) {
    test(`pasting a ${source} into an empty ${destination} item keeps valid list children`, async ({
      page,
    }) => {
      await page.goto('/examples/richtext')
      const textbox = page.getByRole('textbox')
      const editor = await getEditorHandle(textbox)
      const item = (text: string) => ({
        type: 'list-item',
        children: [{ text }],
      })
      const before = [
        { type: source, children: [item('one'), item('two')] },
        {
          type: destination,
          children: [item('before'), item(''), item('after')],
        },
      ]
      await textbox.focus()
      await editor.evaluate((editor, value) => {
        editor.children = value
        editor.select({
          anchor: { path: [0, 0, 0], offset: 0 },
          focus: { path: [0, 1, 0], offset: 3 },
        })
        ;(editor as HistoryEditor).history = { undos: [], redos: [] }
        editor.onChange()
      }, before)
      await expect(textbox.locator('li')).toHaveText([
        'one',
        'two',
        'before',
        '',
        'after',
      ])
      const fragment = await editor.evaluate(editor => {
        const data = new DataTransfer()
        ;(
          editor as typeof editor & {
            setFragmentData(data: DataTransfer): void
          }
        ).setFragmentData(data)
        return data.getData('application/x-slate-fragment')
      })
      expect(fragment).not.toBe('')
      await editor.evaluate(editor =>
        editor.select({ path: [1, 1, 0], offset: 0 })
      )
      await textbox.evaluate((element, fragment) => {
        const clipboardData = {
          types: ['text/plain'],
          getData: (type: string) =>
            type === 'application/x-slate-fragment'
              ? fragment
              : type === 'text/plain'
              ? 'one\ntwo'
              : '',
        }
        element.dispatchEvent(
          Object.assign(
            new Event('paste', { bubbles: true, cancelable: true }),
            { clipboardData }
          )
        )
      }, fragment)
      const after = [
        before[0],
        {
          type: destination,
          children: [item('before'), item('one'), item('two'), item('after')],
        },
      ]
      await expect
        .poll(() => editor.evaluate(editor => editor.children))
        .toEqual(after)
      await expect(textbox.locator('ul > :not(li), ol > :not(li)')).toHaveCount(
        0
      )
      await expect
        .poll(() => editor.evaluate(editor => editor.selection?.anchor))
        .toEqual({ path: [1, 2, 0], offset: 3 })
      await page.keyboard.type('!')
      await expect(textbox.locator('li')).toHaveText([
        'one',
        'two',
        'before',
        'one',
        'two!',
        'after',
      ])
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
      await editor.dispose()
    })
  }
}
