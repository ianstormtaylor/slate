import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('texts-to', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text key="a" />
        <text key="b" />
        <text key="c" />
        <text key="d" />
      </element>
    </editor>
  )
  const test = value => {
    return Array.from(
      Node.texts(value, {
        from: [0, 1],
        to: [0, 2],
      })
    )
  }
  const output = [
    [<text key="b" />, [0, 1]],
    [<text key="c" />, [0, 2]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
