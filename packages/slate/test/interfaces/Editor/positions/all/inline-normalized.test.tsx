import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-all-inline-normalized', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <text />
        <inline>o</inline>
        <text />
      </block>
    </editor>
  )

  const test = editor => {
    return Array.from(
      Editor.positions(editor, {
        at: Editor.range(editor, []),
        unit: 'character',
      })
    )
  }

  // this is the output but it's incorrect.
  // there should be two positions, before the character and after the character
  const output = [
    { path: [0, 0], offset: 0 },
    { path: [0, 1, 0], offset: 1 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
