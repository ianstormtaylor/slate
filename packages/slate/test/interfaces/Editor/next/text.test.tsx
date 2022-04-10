import { test, expect } from 'vitest'
import { Editor, Text } from 'slate'
import { jsx } from '../../..'

test('next-text', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )
  const test = editor => {
    return Editor.next(editor, { at: [0], match: Text.isText })
  }
  const output = [<text>two</text>, [1, 0]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
