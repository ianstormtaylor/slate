import { test, expect } from 'vitest'
import { Range } from 'slate'

test('isBackward-backward', () => {
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
    return Range.isBackward(range)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
