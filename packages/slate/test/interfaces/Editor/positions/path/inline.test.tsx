import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-path-inline', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one<inline>two</inline>three
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.positions(editor, { at: [0, 1] }))
  }
  const output = [
    { path: [0, 1, 0], offset: 0 },
    { path: [0, 1, 0], offset: 1 },
    { path: [0, 1, 0], offset: 2 },
    { path: [0, 1, 0], offset: 3 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
