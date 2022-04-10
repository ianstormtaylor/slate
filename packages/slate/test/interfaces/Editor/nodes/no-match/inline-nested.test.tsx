import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-no-match-inline-nested', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one
        <inline>
          two<inline>three</inline>four
        </inline>
        five
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
        one
        <inline>
          two<inline>three</inline>four
        </inline>
        five
      </block>,
      [0],
    ],
    [<text>one</text>, [0, 0]],
    [
      <inline>
        two<inline>three</inline>four
      </inline>,
      [0, 1],
    ],
    [<text>two</text>, [0, 1, 0]],
    [<inline>three</inline>, [0, 1, 1]],
    [<text>three</text>, [0, 1, 1, 0]],
    [<text>four</text>, [0, 1, 2]],
    [<text>five</text>, [0, 2]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
