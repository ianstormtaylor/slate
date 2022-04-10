import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperation-object', () => {
  const input = {}
  const test = value => {
    return Operation.isOperation(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
