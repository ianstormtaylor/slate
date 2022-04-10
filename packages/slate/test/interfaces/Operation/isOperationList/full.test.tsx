import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperationList-full', () => {
  const input = [
    {
      type: 'set_node',
      path: [0],
      properties: {},
      newProperties: {},
    },
  ]
  const test = value => {
    return Operation.isOperationList(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
