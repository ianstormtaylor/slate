import { test, expect } from 'vitest'
import { Range } from 'slate'

test('isForward-collapsed', () => {
  const input = {
    anchor: {
      path: [0],
      offset: 0,
    },
    focus: {
      path: [0],
      offset: 0,
    },
  }
  const test = range => {
    return Range.isForward(range)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
