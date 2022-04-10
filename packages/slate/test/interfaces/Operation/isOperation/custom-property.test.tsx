import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperation-custom-property', () => {
  const input = {
    type: 'set_node',
    path: [0],
    properties: {},
    newProperties: {},
    custom: true,
  }
  const test = value => {
    return Operation.isOperation(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
