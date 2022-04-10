import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('string-block-across', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <block>
        <text>one</text>
        <text>two</text>
      </block>
      <block>
        <text>three</text>
        <text>four</text>
      </block>
    </editor>
  )
  const test = editor => {
    return Editor.string(editor, [])
  }
  const output = `onetwothreefour`

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
