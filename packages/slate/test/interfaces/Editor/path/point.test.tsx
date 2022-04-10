import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('path-point', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.path(editor, { path: [0, 0], offset: 1 })
  }
  const output = [0, 0]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
