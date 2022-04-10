import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-match-function-editor', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
      <block>three</block>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.nodes(editor, {
        at: [],
        match: () => true,
        mode: 'highest',
      })
    )
  }
  const output = [[input, []]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
