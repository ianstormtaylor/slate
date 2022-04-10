import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('isEnd-path-end', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one
        <cursor />
      </block>
    </editor>
  )
  const test = editor => {
    const { anchor } = editor.selection
    return Editor.isEnd(editor, anchor, [0])
  }
  const output = true

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
