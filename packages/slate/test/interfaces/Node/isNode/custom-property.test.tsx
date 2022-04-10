import { test, expect } from 'vitest'
import { Node } from 'slate'

test('isNode-custom-property', () => {
  const input = {
    children: [],
    custom: true,
  }
  const test = value => {
    return Node.isNode(value)
  }
  const output = true

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
