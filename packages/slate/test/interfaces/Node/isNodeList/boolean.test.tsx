import { test, expect } from 'vitest'
import { Node } from 'slate'

test('isNodeList-boolean', () => {
  const input = true
  const test = value => {
    return Node.isNodeList(value)
  }
  const output = false

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
