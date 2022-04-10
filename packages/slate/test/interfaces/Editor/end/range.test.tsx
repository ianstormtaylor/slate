import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('end-range', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.end(editor, {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 2 },
    })
  }
  const output = { path: [0, 0], offset: 2 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
