import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-no-match-block-reverse', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.nodes(editor, { at: [], reverse: true }))
  }
  const output = [
    [input, []],
    [<block>two</block>, [1]],
    [<text>two</text>, [1, 0]],
    [<block>one</block>, [0]],
    [<text>one</text>, [0, 0]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
