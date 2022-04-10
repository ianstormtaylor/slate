import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('unhangRange-block-hanging', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <anchor />
        word
      </block>
      <block>
        <focus />
        another
      </block>
    </editor>
  )

  const test = editor => {
    return Editor.unhangRange(editor, editor.selection)
  }

  const output = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 4 },
  }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
