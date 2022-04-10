import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('range-point', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.range(editor, { path: [0, 0], offset: 1 })
  }
  const output = {
    anchor: { path: [0, 0], offset: 1 },
    focus: { path: [0, 0], offset: 1 },
  }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
