import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('string-text', () => {
  /** @jsx jsx  */

  const input = <text>one</text>
  const test = value => {
    return Node.string(value)
  }
  const output = `one`

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
