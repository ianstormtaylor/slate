import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from 'slate-hyperscript'

test('levels-success', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text />
      </element>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.levels(editor, { at: [0, 0] }))
  }
  const output = [
    [input, []],
    [
      <element>
        <text />
      </element>,
      [0],
    ],
    [<text />, [0, 0]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
