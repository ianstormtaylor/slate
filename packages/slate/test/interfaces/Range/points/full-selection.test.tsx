import { test, expect } from 'vitest'
import { Range } from 'slate'

test('points-full-selection', () => {
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
  const test = value => {
    return Array.from(Range.points(value))
  }
  const output = [
    [input.anchor, 'anchor'],
    [input.focus, 'focus'],
  ]

  const result = test(input)
  expect(result).toEqual(output)
})
