import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('string-element', () => {
  /** @jsx jsx  */

  const input = (
    <element>
      <text>one</text>
      <text>two</text>
    </element>
  )
  const test = value => {
    return Node.string(value, [1])
  }
  const output = `onetwo`

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
