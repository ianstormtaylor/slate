import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('before-path-void', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block void>one</block>
      <block void>two</block>
    </editor>
  )

  const test = editor => {
    return Editor.before(editor, [1, 0], { voids: true })
  }

  const output = { path: [0, 0], offset: 3 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
