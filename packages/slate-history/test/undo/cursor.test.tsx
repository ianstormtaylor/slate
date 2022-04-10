/** @jsx jsx */
import { test, expect, describe } from 'vitest'
import { Transforms, Editor } from 'slate'
import { jsx } from '../jsx'
import { withHistory } from 'slate-history'
import { withTest } from '../with-test'

describe.concurrent('cursor', () => {
  test('cursor-keep_after_focus_and_remove_text_undo', () => {
    const run = editor => {
      // focus at the end
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 5 },
        focus: { path: [0, 0], offset: 5 },
      })
      // select all
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 5 },
        focus: { path: [0, 0], offset: 0 },
      })
      // remove
      Editor.deleteFragment(editor)
      // blur
      Transforms.deselect(editor)
      // focus back
      Transforms.select(editor, {
        anchor: { path: [0, 0], offset: 0 },
        focus: { path: [0, 0], offset: 0 },
      })
    }

    const input = (
      <editor>
        <block>Hello</block>
      </editor>
    )

    const output = {
      children: [
        {
          children: [
            {
              text: 'Hello',
            },
          ],
        },
      ],
      selection: {
        anchor: { path: [0, 0], offset: 5 },
        focus: { path: [0, 0], offset: 5 },
      },
    }

    const editor = withTest(withHistory(input))
    run(editor)
    editor.undo()
    expect(editor.children).toEqual(output.children)
    expect(editor.selection).toEqual(output.selection)
  })
})
