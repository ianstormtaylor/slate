import { test, expect } from 'vitest'
import { Range } from 'slate'

test('isRange-custom-property', () => {
  const input = {
    anchor: {
      path: [0, 1],
      offset: 0,
    },
    focus: {
      path: [0, 1],
      offset: 0,
    },
    custom: 'value',
  }
  const test = value => {
    return Range.isRange(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
