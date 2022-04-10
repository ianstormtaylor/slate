import { test, expect } from 'vitest'
import { Point } from 'slate'

test('compare-path-equal-offset-before', () => {
  const input = {
    point: {
      path: [0, 1],
      offset: 0,
    },
    another: {
      path: [0, 1],
      offset: 3,
    },
  }
  const test = ({ point, another }) => {
    return Point.compare(point, another)
  }
  const output = -1

  const result = test(input)
  expect(result).toEqual(output)
})
