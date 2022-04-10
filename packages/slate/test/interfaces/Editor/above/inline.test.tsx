import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('above-inline', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one<inline>two</inline>three
      </block>
    </editor>
  )

  const test = editor => {
    return Editor.above(editor, {
      at: [0, 1, 0],
      match: n => Editor.isInline(editor, n),
    })
  }

  const output = [<inline>two</inline>, [0, 1]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
