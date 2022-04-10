import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-no-match-block-multiple', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.nodes(editor, { at: [] }))
  }
  const output = [
    [input, []],
    [<block>one</block>, [0]],
    [<text>one</text>, [0, 0]],
    [<block>two</block>, [1]],
    [<text>two</text>, [1, 0]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
