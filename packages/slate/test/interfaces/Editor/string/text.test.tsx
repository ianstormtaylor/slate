import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('string-text', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <block>
        <text>one</text>
        <text>two</text>
      </block>
    </editor>
  )
  const test = editor => {
    return Editor.string(editor, [0, 0])
  }
  const output = `one`

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
