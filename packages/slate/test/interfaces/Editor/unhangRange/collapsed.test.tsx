import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('unhangRange-collapsed', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one
        <cursor />
      </block>
    </editor>
  )
  const test = editor => {
    return Editor.unhangRange(editor, editor.selection)
  }
  const output = {
    anchor: { path: [0, 0], offset: 3 },
    focus: { path: [0, 0], offset: 3 },
  }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
