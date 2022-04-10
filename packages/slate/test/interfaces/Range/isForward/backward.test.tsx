import { test, expect } from 'vitest'
import { Range } from 'slate'

test('isForward-backward', () => {
  const input = {
    anchor: {
      path: [3],
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
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
