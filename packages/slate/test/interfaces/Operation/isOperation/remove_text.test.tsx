import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperation-remove_text', () => {
  const input = {
    type: 'remove_text',
    path: [0],
    offset: 0,
    text: 'string',
  }
  const test = value => {
    return Operation.isOperation(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
