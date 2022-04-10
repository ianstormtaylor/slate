import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('start-range', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>one</block>
    </editor>
  )
  const test = editor => {
    return Editor.start(editor, {
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 3 },
    })
  }
  const output = { path: [0, 0], offset: 1 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
