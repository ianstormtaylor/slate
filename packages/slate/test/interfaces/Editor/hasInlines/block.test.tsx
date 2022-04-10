import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('hasInlines-block', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    const block = editor.children[0]
    return Editor.hasInlines(editor, block)
  }
  const output = true

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
