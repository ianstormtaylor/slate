import { test, expect } from 'vitest'
import { Node } from 'slate'
import { jsx } from 'slate-hyperscript'
import { cloneDeep } from 'lodash'

test('get-root', () => {
  /** @jsx jsx  */

  const input = (
    <editor>
      <element>
        <text />
      </element>
    </editor>
  )
  const test = value => {
    return Node.get(value, [])
  }
  const skip = true // TODO: see https://github.com/ianstormtaylor/slate/pull/4188
  const output = cloneDeep(input)

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
