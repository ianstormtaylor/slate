import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('nodes-mode-universal-some-nested', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block a>
        <block a>one</block>
      </block>
      <block b>
        <block b>two</block>
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.nodes(editor, {
        at: [],
        match: n => n.a,
        mode: 'lowest',
        universal: true,
      })
    )
  }
  const output = []

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
