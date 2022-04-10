import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperation-set_selection', () => {
  const input = {
    type: 'set_selection',
    properties: {},
    newProperties: {},
  }
  const test = value => {
    return Operation.isOperation(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
