import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperation-merge_node', () => {
  const input = {
    type: 'merge_node',
    path: [0],
    position: 0,
    properties: {},
  }
  const test = value => {
    return Operation.isOperation(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
