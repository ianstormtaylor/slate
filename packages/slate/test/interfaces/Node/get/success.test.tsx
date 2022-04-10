import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('get-success', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text />
      </element>
    </editor>
  )
  const test = value => {
    return Node.get(value, [0])
  }
  const output = (
    <element>
      <text />
    </element>
  )

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
