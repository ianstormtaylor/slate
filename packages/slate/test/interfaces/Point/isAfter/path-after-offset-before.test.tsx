import { test, expect } from 'vitest'
import { Point } from 'slate'

test('isAfter-path-after-offset-before', () => {
  const input = {
    point: {
      path: [0, 4],
      offset: 0,
    },
    another: {
      path: [0, 1],
      offset: 3,
    },
  }
  const test = ({ point, another }) => {
    return Point.isAfter(point, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
