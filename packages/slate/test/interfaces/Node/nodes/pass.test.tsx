import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('nodes-pass', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <element>
          <text key="a" />
        </element>
      </element>
    </editor>
  )
  const test = value => {
    return Array.from(Node.nodes(value, { pass: ([n, p]) => p.length > 1 }))
  }
  const output = [
    [input, []],
    [
      <element>
        <element>
          <text key="a" />
        </element>
      </element>,
      [0],
    ],
    [
      <element>
        <text key="a" />
      </element>,
      [0, 0],
    ],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
