import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('node-point', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.node(editor, { path: [0, 0], offset: 1 })
  }
  const output = [<text>one</text>, [0, 0]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
