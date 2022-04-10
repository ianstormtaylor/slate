import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('first-success', () => {
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
    return Node.first(value, [0])
  }
  const output = [<text key="a" />, [0, 0]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
