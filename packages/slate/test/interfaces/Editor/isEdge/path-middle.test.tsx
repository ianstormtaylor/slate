import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('isEdge-path-middle', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        on
        <cursor />e
      </block>
    </editor>
  )
  const test = editor => {
    const { anchor } = editor.selection
    return Editor.isEdge(editor, anchor, [0])
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
