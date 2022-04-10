import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('isEmpty-inline-empty', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one
        <inline />
        three
      </block>
    </editor>
  )
  const test = editor => {
    const inline = editor.children[0].children[1]
    return Editor.isEmpty(editor, inline)
  }
  const output = true

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
