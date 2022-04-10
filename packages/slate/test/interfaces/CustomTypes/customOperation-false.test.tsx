import { test, expect } from 'vitest'
import { Operation } from 'slate'
import { isCustomOperation } from './type-guards'

test('customOperation-false', () => {
  const input: Operation = {
    type: 'insert_text',
    path: [0, 0],
    offset: 0,
    text: 'text',
  }

  const test = isCustomOperation

  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
