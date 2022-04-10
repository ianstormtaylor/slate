import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('after-range-void', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block void>one</block>
      <block void>two</block>
    </editor>
  )

  const test = editor => {
    return Editor.after(
      editor,
      {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [1, 0], offset: 2 },
      },
      { voids: true }
    )
  }

  const output = { path: [1, 0], offset: 3 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
