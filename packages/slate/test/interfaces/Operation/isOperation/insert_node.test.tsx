import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperation-insert_node', () => {
  const input = {
    type: 'insert_node',
    path: [0],
    node: {
      children: [],
    },
  }
  const test = value => {
    return Operation.isOperation(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
