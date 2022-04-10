import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('isEmpty-block-blank', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <text />
      </block>
    </editor>
  )
  const test = editor => {
    const block = editor.children[0]
    return Editor.isEmpty(editor, block)
  }
  const output = true

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
