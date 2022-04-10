import { test, expect } from 'vitest'
import { Node } from 'slate'

test('isNodeList-full-element', () => {
  const input = [
    {
      children: [],
    },
  ]
  const test = value => {
    return Node.isNodeList(value)
  }
  const output = true

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
