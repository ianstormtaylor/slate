import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-no-match-block-nested', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <block>one</block>
      </block>
      <block>
        <block>two</block>
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.nodes(editor, { at: [] }))
  }
  const output = [
    [input, []],
    [
      <block>
        <block>one</block>
      </block>,
      [0],
    ],
    [<block>one</block>, [0, 0]],
    [<text>one</text>, [0, 0, 0]],
    [
      <block>
        <block>two</block>
      </block>,
      [1],
    ],
    [<block>two</block>, [1, 0]],
    [<text>two</text>, [1, 0, 0]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
