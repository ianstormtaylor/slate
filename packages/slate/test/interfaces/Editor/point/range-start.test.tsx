import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('point-range-start', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )
  const test = editor => {
    return Editor.point(
      editor,
      {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 1], offset: 2 },
      },
      { edge: 'start' }
    )
  }
  const output = { path: [0, 0], offset: 1 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
