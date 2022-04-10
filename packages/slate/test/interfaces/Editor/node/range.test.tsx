import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('node-range', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )
  const test = editor => {
    return Editor.node(editor, {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [1, 0], offset: 2 },
    })
  }
  const output = [input, []]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
