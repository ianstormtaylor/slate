import { test, expect } from 'vitest'
import { Editor, Text } from 'slate'
import { jsx } from '../../..'

test('previous-text', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )
  const test = editor => {
    return Editor.previous(editor, { at: [1], match: Text.isText })
  }
  const output = [<text>one</text>, [0, 0]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
