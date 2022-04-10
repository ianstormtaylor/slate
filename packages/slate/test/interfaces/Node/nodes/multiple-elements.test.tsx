import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('nodes-multiple-elements', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text key="a" />
      </element>
      <element>
        <text key="b" />
      </element>
    </editor>
  )
  const test = value => {
    return Array.from(Node.nodes(value))
  }
  const output = [
    [input, []],
    [
      <element>
        <text key="a" />
      </element>,
      [0],
    ],
    [<text key="a" />, [0, 0]],
    [
      <element>
        <text key="b" />
      </element>,
      [1],
    ],
    [<text key="b" />, [1, 0]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
