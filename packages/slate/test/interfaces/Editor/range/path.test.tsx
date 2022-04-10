import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('range-path', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.range(editor, [0])
  }
  const output = {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 3 },
  }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
