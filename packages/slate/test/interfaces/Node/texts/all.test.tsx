import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('texts-all', () => {
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
    return Array.from(Node.texts(value))
  }
  const output = [
    [<text key="a" />, [0, 0]],
    [<text key="b" />, [0, 1]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
