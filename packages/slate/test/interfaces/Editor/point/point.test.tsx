import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('point-point', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.point(editor, { path: [0, 0], offset: 1 })
  }
  const output = { path: [0, 0], offset: 1 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
