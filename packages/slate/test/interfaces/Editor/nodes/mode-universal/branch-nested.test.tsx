import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-mode-universal-branch-nested', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block a>
        <block b>one</block>
      </block>
      <block b>
        <block a>two</block>
      </block>
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
    [
      <block a>
        <block b>one</block>
      </block>,
      [0],
    ],
    [<block a>two</block>, [1, 0]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
