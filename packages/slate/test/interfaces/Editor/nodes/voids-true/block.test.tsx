import { test, expect } from 'vitest'
import { Editor, Text } from 'slate'
import { jsx } from '../../../..'

test('nodes-voids-true-block', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block void>one</block>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.nodes(editor, { at: [], match: Text.isText, voids: true })
    )
  }
  const output = [[<text>one</text>, [0, 0]]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
