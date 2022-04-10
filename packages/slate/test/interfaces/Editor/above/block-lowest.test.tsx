import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../..'

test('above-block-lowest', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <block>one </block>
      </block>
    </editor>
  )

  const test = editor => {
    return Editor.above(editor, {
      at: [0, 0, 0],
      match: n => Editor.isBlock(editor, n),
      mode: 'lowest',
    })
  }

  const output = [<block>one </block>, [0, 0]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
