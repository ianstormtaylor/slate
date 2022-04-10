import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('isStart-path-end', () => {
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
    return Editor.isStart(editor, anchor, [0])
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
