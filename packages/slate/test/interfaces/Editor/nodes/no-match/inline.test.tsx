import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-no-match-inline', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one<inline>two</inline>three
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
        one<inline>two</inline>three
      </block>,
      [0],
    ],
    [<text>one</text>, [0, 0]],
    [<inline>two</inline>, [0, 1]],
    [<text>two</text>, [0, 1, 0]],
    [<text>three</text>, [0, 2]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
