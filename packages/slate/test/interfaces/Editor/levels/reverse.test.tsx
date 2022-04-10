import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from 'slate-hyperscript'

test('levels-reverse', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text />
      </element>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.levels(editor, {
        at: [0, 0],
        reverse: true,
      })
    )
  }
  const output = [
    [<text />, [0, 0]],
    [
      <element>
        <text />
      </element>,
      [0],
    ],
    [input, []],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
