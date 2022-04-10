import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperationList-not-full-operaion', () => {
  const input = [
    {
      type: 'set_node',
      path: [0],
      properties: {},
      newProperties: {},
    },
    {
      text: '',
    },
  ]
  const test = value => {
    return Operation.isOperationList(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
