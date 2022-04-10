import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('after-point-void', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block void>one</block>
    </editor>
  )

  const test = editor => {
    return Editor.after(editor, { path: [0, 0], offset: 1 }, { voids: true })
  }

  const output = { path: [0, 0], offset: 2 }

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
