import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from 'slate-hyperscript'

test('levels-match', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element a>
        <text a />
      </element>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.levels(editor, {
        at: [0, 0],
        match: n => n.a,
      })
    )
  }
  const output = [
    [
      <element a>
        <text a />
      </element>,
      [0],
    ],
    [<text a />, [0, 0]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
