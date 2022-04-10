import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('after-end', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )

  const test = editor => {
    return Editor.after(editor, [1, 0])
  }

  const output = undefined

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
