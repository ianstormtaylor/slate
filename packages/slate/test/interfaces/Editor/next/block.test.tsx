import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('next-block', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )
  const test = editor => {
    return Editor.next(editor, {
      at: [0],
      match: n => Editor.isBlock(editor, n),
    })
  }
  const output = [<block>two</block>, [1]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
