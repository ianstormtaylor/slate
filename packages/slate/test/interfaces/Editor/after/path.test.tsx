import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('after-path', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )

  const test = editor => {
    return Editor.after(editor, [0, 0])
  }

  const output = { path: [1, 0], offset: 0 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
