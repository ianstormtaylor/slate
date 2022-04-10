import { test, expect } from 'vitest'
import { Point } from 'slate'

test('isAfter-path-equal-offset-equal', () => {
  const input = {
    point: {
      path: [0, 1],
      offset: 7,
    },
    another: {
      path: [0, 1],
      offset: 7,
    },
  }
  const test = ({ point, another }) => {
    return Point.isAfter(point, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
