import { test, expect } from 'vitest'
import { Range } from 'slate'

test('isCollapsed-expanded', () => {
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
    return Range.isCollapsed(range)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
