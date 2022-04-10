import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperation-boolean', () => {
  const input = true
  const test = value => {
    return Operation.isOperation(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
