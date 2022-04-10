import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-no-match-block-void', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block void>one</block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.nodes(editor, { at: [] }))
  }
  const output = [
    [input, []],
    [<block void>one</block>, [0]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
