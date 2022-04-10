import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('elements-reverse', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text key="a" />
        <text key="b" />
      </element>
    </editor>
  )
  const test = value => {
    return Array.from(Node.elements(value, { reverse: true }))
  }
  const output = [
    [
      <element>
        <text key="a" />
        <text key="b" />
      </element>,
      [0],
    ],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
