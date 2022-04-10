import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('texts-from', () => {
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
    return Array.from(Node.texts(value, { from: [0, 1] }))
  }
  const output = [[<text key="b" />, [0, 1]]]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
