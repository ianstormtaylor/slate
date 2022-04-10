import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('isEmpty-block-void', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block void>
        <text />
      </block>
    </editor>
  )
  const test = editor => {
    const block = editor.children[0]
    return Editor.isEmpty(editor, block)
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
