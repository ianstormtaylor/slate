import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('point-path', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.point(editor, [0])
  }
  const output = { path: [0, 0], offset: 0 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
