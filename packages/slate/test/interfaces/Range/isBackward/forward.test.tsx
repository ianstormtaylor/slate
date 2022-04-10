import { test, expect } from 'vitest'
import { Range } from 'slate'

test('isBackward-forward', () => {
  const input = {
    anchor: {
      path: [0],
      offset: 0,
    },
    focus: {
      path: [3],
      offset: 0,
    },
  }
  const test = range => {
    return Range.isBackward(range)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
