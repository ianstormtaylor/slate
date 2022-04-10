import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-range-block-reverse', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
      <block>three</block>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.positions(editor, {
        reverse: true,
        at: {
          anchor: { path: [0, 0], offset: 1 },
          focus: { path: [2, 0], offset: 2 },
        },
      })
    )
  }
  const output = [
    { path: [2, 0], offset: 2 },
    { path: [2, 0], offset: 1 },
    { path: [2, 0], offset: 0 },
    { path: [1, 0], offset: 3 },
    { path: [1, 0], offset: 2 },
    { path: [1, 0], offset: 1 },
    { path: [1, 0], offset: 0 },
    { path: [0, 0], offset: 3 },
    { path: [0, 0], offset: 2 },
    { path: [0, 0], offset: 1 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
