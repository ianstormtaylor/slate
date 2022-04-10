import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('hasBlocks-block-nested', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <block>one</block>
      </block>
    </editor>
  )
  const test = editor => {
    const block = editor.children[0]
    return Editor.hasBlocks(editor, block)
  }
  const output = true

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
