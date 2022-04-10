import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-path-block-nested', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <block>one</block>
        <block>two</block>
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.positions(editor, { at: [0] }))
  }
  const output = [
    { path: [0, 0, 0], offset: 0 },
    { path: [0, 0, 0], offset: 1 },
    { path: [0, 0, 0], offset: 2 },
    { path: [0, 0, 0], offset: 3 },
    { path: [0, 1, 0], offset: 0 },
    { path: [0, 1, 0], offset: 1 },
    { path: [0, 1, 0], offset: 2 },
    { path: [0, 1, 0], offset: 3 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
