import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('hasBlocks-inline-nested', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one
        <inline>
          two<inline>three</inline>four
        </inline>
        five
      </block>
    </editor>
  )
  const test = editor => {
    const inline = editor.children[0].children[1]
    return Editor.hasBlocks(editor, inline)
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
