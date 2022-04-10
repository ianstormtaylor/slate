import { test, expect } from 'vitest'
import { Range } from 'slate'

test('edges-collapsed', () => {
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
    return Range.edges(range)
  }
  const output = [
    {
      path: [0],
      offset: 0,
    },
    {
      path: [0],
      offset: 0,
    },
  ]

  const result = test(input)
  expect(result).toEqual(output)
})
