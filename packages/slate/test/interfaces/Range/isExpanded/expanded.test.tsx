import { test, expect } from 'vitest'
import { Range } from 'slate'

test('isExpanded-expanded', () => {
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
    return Range.isExpanded(range)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
