import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('parent-success', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text />
      </element>
    </editor>
  )
  const test = value => {
    return Node.parent(value, [0, 0])
  }
  const output = (
    <element>
      <text />
    </element>
  )

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
