import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-path-block-reverse', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.positions(editor, { reverse: true, at: [0, 0] }))
  }
  const output = [
    { path: [0, 0], offset: 3 },
    { path: [0, 0], offset: 2 },
    { path: [0, 0], offset: 1 },
    { path: [0, 0], offset: 0 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
