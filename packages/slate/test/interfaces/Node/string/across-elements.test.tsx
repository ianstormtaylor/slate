import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('string-across-elements', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text>one</text>
        <text>two</text>
      </element>
      <element>
        <text>three</text>
        <text>four</text>
      </element>
    </editor>
  )
  const test = value => {
    return Node.string(value)
  }
  const output = `onetwothreefour`

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
