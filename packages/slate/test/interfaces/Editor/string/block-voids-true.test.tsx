import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('string-block-voids-true', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <block void>
        <text>one</text>
        <text>two</text>
      </block>
    </editor>
  )
  const test = editor => {
    return Editor.string(editor, [0], { voids: true })
  }
  const output = `onetwo`

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
