import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('before-range-void', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block void>one</block>
      <block void>two</block>
    </editor>
  )

  const test = editor => {
    return Editor.before(
      editor,
      {
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 1], offset: 2 },
      },
      { voids: true }
    )
  }

  const output = { path: [0, 0], offset: 0 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
