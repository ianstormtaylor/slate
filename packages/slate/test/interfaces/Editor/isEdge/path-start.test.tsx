import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('isEdge-path-start', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <cursor />
        one
      </block>
    </editor>
  )
  const test = editor => {
    const { anchor } = editor.selection
    return Editor.isEdge(editor, anchor, [0])
  }
  const output = true

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
