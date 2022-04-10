import { test, expect } from 'vitest'
import { Range } from 'slate'

test('isExpanded-collapsed', () => {
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
    return Range.isExpanded(range)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
