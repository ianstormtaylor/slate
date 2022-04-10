import { test, expect } from 'vitest'
import { Range } from 'slate'

test('isRange-without-focus', () => {
  const input = {
    anchor: {
      path: [0, 1],
      offset: 0,
    },
  }
  const test = value => {
    return Range.isRange(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
