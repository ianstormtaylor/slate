import { test, expect } from 'vitest'
import { Node } from 'slate'

test('isNode-element', () => {
  const input = {
    children: [],
  }
  const test = value => {
    return Node.isNode(value)
  }
  const output = true

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
