import { test, expect } from 'vitest'
import { Point } from 'slate'

test('compare-path-equal-offset-equal', () => {
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
    return Point.compare(point, another)
  }
  const output = 0

  const result = test(input)
  expect(result).toEqual(output)
})
