import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('before-start', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
      <block>two</block>
    </editor>
  )

  const test = editor => {
    return Editor.before(editor, [0, 0])
  }

  const output = undefined

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
