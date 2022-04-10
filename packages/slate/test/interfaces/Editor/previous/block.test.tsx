import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('previous-block', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )
  const test = editor => {
    return Editor.previous(editor, {
      at: [1],
      match: n => Editor.isBlock(editor, n),
    })
  }
  const output = [<block>one</block>, [0]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
