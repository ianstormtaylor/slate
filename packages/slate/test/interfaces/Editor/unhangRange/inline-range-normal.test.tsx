import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('unhangRange-inline-range-normal', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <text>Block before</text>
      </block>
      <block>
        <text>
          <anchor />
          Some text before{' '}
        </text>
        <inline void>
          <focus />
        </inline>
        <text />
      </block>
      <block>
        <text>Another block</text>
      </block>
    </editor>
  )

  const test = editor => {
    const range = Editor.unhangRange(editor, editor.selection)
    return range
  }

  const output = {
    anchor: { path: [1, 0], offset: 0 },
    focus: { path: [1, 1, 0], offset: 0 },
  }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
