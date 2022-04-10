import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('point-path-end', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.point(editor, [0], { edge: 'end' })
  }
  const output = { path: [0, 0], offset: 3 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
