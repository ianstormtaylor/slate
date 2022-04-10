import { test, expect } from 'vitest'
import { Range } from 'slate'

test('isRange-boolean', () => {
  const input = true
  const test = value => {
    return Range.isRange(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
