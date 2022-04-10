import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('after-path-void', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block void>
        <text>one</text>
        <text>two</text>
      </block>
    </editor>
  )

  const test = editor => {
    return Editor.after(editor, [0, 0], { voids: true })
  }

  const output = { path: [0, 1], offset: 0 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
