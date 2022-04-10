import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('isVoid-inline', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one<inline>two</inline>three
      </block>
    </editor>
  )
  const test = editor => {
    const inline = editor.children[0].children[1]
    return Editor.isVoid(editor, inline)
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
