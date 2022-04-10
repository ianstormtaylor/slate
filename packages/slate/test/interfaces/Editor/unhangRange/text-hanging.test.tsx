import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('unhangRange-text-hanging', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <text>
          before
          <anchor />
        </text>
        <text>selected</text>
        <text>
          <focus />
          after
        </text>
      </block>
    </editor>
  )

  const test = editor => {
    return Editor.unhangRange(editor, editor.selection)
  }

  const output = {
    anchor: { path: [0, 0], offset: 6 },
    focus: { path: [0, 2], offset: 0 },
  }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
