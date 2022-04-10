import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-mode-lowest-block', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block a>
        <block a>one</block>
      </block>
      <block a>
        <block a>two</block>
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.nodes(editor, { at: [], match: n => n.a, mode: 'lowest' })
    )
  }
  const output = [
    [<block a>one</block>, [0, 0]],
    [<block a>two</block>, [1, 0]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
