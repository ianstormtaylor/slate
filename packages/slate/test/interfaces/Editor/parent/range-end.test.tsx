import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('parent-range-end', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )
  const test = editor => {
    return Editor.parent(
      editor,
      {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [1, 0], offset: 2 },
      },
      { edge: 'end' }
    )
  }
  const output = [<block>two</block>, [1]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
