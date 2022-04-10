import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-no-match-inline-void', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one<inline void>two</inline>three
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.nodes(editor, { at: [] }))
  }
  const output = [
    [input, []],
    [
      <block>
        one<inline void>two</inline>three
      </block>,
      [0],
    ],
    [<text>one</text>, [0, 0]],
    [<inline void>two</inline>, [0, 1]],
    [<text>three</text>, [0, 2]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
