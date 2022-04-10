import { test, expect } from 'vitest'
import { Operation } from 'slate'

test('isOperation-insert_text', () => {
  const input = {
    type: 'insert_text',
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
