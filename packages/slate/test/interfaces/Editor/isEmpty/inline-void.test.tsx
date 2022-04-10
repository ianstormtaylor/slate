import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('isEmpty-inline-void', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one
        <inline void>
          <text />
        </inline>
        three
      </block>
    </editor>
  )
  const test = editor => {
    const inline = editor.children[0].children[1]
    return Editor.isEmpty(editor, inline)
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
