import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('leaf-success', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text />
      </element>
    </editor>
  )
  const test = value => {
    return Node.leaf(value, [0, 0])
  }
  const output = <text />

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
