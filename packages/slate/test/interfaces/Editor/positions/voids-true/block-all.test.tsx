import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-voids-true-block-all', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block void>one</block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.positions(editor, { at: [], voids: true }))
  }
  const output = [
    { path: [0, 0], offset: 0 },
    { path: [0, 0], offset: 1 },
    { path: [0, 0], offset: 2 },
    { path: [0, 0], offset: 3 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
