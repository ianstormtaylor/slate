import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('ancestors-success', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text />
      </element>
    </editor>
  )
  const test = value => {
    return Array.from(Node.ancestors(value, [0, 0]))
  }
  const output = [
    [input, []],
    [input.children[0], [0]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
