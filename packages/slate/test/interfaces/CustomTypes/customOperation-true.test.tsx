import { test, expect } from 'vitest'
import { Operation } from 'slate'
import { isCustomOperation } from './type-guards'

test('customOperation-true', () => {
  const input: Operation = {
    type: 'custom_op',
    value: 'some value',
  }

  const test = isCustomOperation

  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
