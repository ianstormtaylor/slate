import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('path-path', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.path(editor, [0])
  }
  const output = [0]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
