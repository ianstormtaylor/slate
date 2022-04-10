import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-all-unit-word-reverse', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one two three</block>
      <block>four five six</block>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.positions(editor, { at: [], unit: 'word', reverse: true })
    )
  }
  const output = [
    { path: [1, 0], offset: 13 },
    { path: [1, 0], offset: 10 },
    { path: [1, 0], offset: 5 },
    { path: [1, 0], offset: 0 },
    { path: [0, 0], offset: 13 },
    { path: [0, 0], offset: 8 },
    { path: [0, 0], offset: 4 },
    { path: [0, 0], offset: 0 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
