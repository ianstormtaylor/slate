import { test, expect } from 'vitest'
import { Editor, Text } from 'slate'
import { jsx } from '../../../..'

test('nodes-voids-true-inline', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        one<inline void>two</inline>three
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.nodes(editor, { at: [], match: Text.isText, voids: true })
    )
  }
  const output = [
    [<text>one</text>, [0, 0]],
    [<text>two</text>, [0, 1, 0]],
    [<text>three</text>, [0, 2]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
