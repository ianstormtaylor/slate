import { test, expect } from 'vitest'
import { Node } from 'slate'

test('isNodeList-element', () => {
  const input = {
    children: [],
  }
  const test = value => {
    return Node.isNodeList(value)
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
