import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-mode-universal-all', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block a>one</block>
      <block a>two</block>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.nodes(editor, {
        at: [],
        match: n => n.a === true,
        mode: 'lowest',
        universal: true,
      })
    )
  }
  const output = [
    [<block a>one</block>, [0]],
    [<block a>two</block>, [1]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
