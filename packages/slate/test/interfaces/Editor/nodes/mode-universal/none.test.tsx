import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-mode-universal-none', () => {
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
        match: n => n.b === true,
        mode: 'lowest',
        universal: true,
      })
    )
  }
  const output = []

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
