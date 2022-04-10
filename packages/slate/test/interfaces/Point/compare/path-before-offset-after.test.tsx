import { test, expect } from 'vitest'
import { Point } from 'slate'

test('compare-path-before-offset-after', () => {
  const input = {
    point: {
      path: [0, 0],
      offset: 4,
    },
    another: {
      path: [0, 1],
      offset: 0,
    },
  }
  const test = ({ point, another }) => {
    return Point.compare(point, another)
  }
  const output = -1

  const result = test(input)
  expect(result).toEqual(output)
})
