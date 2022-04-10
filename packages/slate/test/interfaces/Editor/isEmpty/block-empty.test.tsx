import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('isEmpty-block-empty', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block />
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
