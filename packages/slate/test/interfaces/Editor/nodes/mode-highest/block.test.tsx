import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-mode-highest-block', () => {
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
      Editor.nodes(editor, { at: [], match: n => n.a, mode: 'highest' })
    )
  }
  const output = [
    [
      <block a>
        <block a>one</block>
      </block>,
      [0],
    ],
    [
      <block a>
        <block a>two</block>
      </block>,
      [1],
    ],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
