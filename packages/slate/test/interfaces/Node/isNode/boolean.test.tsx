import { test, expect } from 'vitest'
import { Node } from 'slate'

test('isNode-boolean', () => {
  const input = true
  const test = value => {
    return Node.isNode(value)
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
