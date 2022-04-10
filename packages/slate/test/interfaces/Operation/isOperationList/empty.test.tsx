import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperationList-empty', () => {
  const input = []
  const test = value => {
    return Operation.isOperationList(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
