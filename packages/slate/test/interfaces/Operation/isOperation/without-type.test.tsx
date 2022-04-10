import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperation-without-type', () => {
  const input = {
    path: [0],
    properties: {},
    newProperties: {},
  }
  const test = value => {
    return Operation.isOperation(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
