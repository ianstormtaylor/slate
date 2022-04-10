import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('string-inline', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <block>
        one<inline>two</inline>three
      </block>
    </editor>
  )
  const test = editor => {
    return Editor.string(editor, [0, 1])
  }
  const output = `two`

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
