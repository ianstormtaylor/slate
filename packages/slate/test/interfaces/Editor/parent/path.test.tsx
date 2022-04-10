import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('parent-path', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.parent(editor, [0, 0])
  }
  const output = [<block>one</block>, [0]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
