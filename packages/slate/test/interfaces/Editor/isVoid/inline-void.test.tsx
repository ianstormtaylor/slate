import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('isVoid-inline-void', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one<inline void>two</inline>three
      </block>
    </editor>
  )
  const test = editor => {
    const inline = editor.children[0].children[1]
    return Editor.isVoid(editor, inline)
  }
  const output = true

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
