import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('parent-range-start', () => {
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
      { edge: 'start' }
    )
  }
  const output = [<block>one</block>, [0]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
