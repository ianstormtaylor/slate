import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'

test('texts-reverse', () => {
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
    return Array.from(Node.texts(value, { reverse: true }))
  }
  const output = [
    [<text key="b" />, [0, 1]],
    [<text key="a" />, [0, 0]],
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
