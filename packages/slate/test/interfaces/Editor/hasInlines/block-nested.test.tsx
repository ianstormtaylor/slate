import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('hasInlines-block-nested', () => {
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
    return Editor.hasInlines(editor, block)
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
