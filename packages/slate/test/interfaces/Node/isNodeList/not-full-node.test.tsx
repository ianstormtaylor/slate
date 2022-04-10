import { test, expect } from 'vitest'
import { Node } from 'slate'

test('isNodeList-not-full-node', () => {
  const input = [
    {
      children: [],
      selection: null,
    },
    'a string',
  ]
  const test = value => {
    return Node.isNodeList(value)
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
