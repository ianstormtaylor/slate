import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperationList-boolean', () => {
  const input = true
  const test = value => {
    return Operation.isOperationList(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
