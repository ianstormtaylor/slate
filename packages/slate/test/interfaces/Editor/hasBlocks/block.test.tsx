import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('hasBlocks-block', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    const block = editor.children[0]
    return Editor.hasBlocks(editor, block)
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
