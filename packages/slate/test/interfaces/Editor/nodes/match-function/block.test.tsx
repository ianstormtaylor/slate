import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-match-function-block', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.nodes(editor, {
        at: [],
        match: n => Editor.isBlock(editor, n),
      })
    )
  }
  const output = [[<block>one</block>, [0]]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
