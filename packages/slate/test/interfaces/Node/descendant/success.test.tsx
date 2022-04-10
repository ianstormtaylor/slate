import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'
import { cloneDeep } from 'lodash'

test('descendant-success', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text />
      </element>
    </editor>
  )
  const test = value => {
    return Node.descendant(value, [0])
  }
  const output = cloneDeep(input.children[0])

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
