import { test, expect } from 'vitest'
import { Range } from 'slate'

test('isCollapsed-collapsed', () => {
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
    return Range.isCollapsed(range)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
