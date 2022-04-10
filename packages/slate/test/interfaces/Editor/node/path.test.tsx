import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('node-path', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.node(editor, [0])
  }
  const output = [<block>one</block>, [0]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
