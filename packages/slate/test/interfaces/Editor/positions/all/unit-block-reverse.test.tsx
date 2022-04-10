import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-all-unit-block-reverse', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one two three</block>
      <block>four five six</block>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.positions(editor, { at: [], unit: 'block', reverse: true })
    )
  }
  const output = [
    { path: [1, 0], offset: 13 },
    { path: [1, 0], offset: 0 },
    { path: [0, 0], offset: 13 },
    { path: [0, 0], offset: 0 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
