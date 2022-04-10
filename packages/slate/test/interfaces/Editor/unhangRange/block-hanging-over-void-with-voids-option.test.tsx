import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('unhangRange-block-hanging-over-void-with-voids-option', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <anchor />
        This is a first paragraph
      </block>
      <block>This is the second paragraph</block>
      <block void />
      <block>
        <focus />
      </block>
    </editor>
  )

  const test = editor => {
    return Editor.unhangRange(editor, editor.selection, { voids: true })
  }

  const output = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [1, 0], offset: 28 },
  }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
