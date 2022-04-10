import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('before-point', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )

  const test = editor => {
    return Editor.before(editor, { path: [0, 0], offset: 1 })
  }

  const output = { path: [0, 0], offset: 0 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
