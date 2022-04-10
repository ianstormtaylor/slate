import { test, expect } from 'vitest'
import { Point } from 'slate'

test('compare-path-after-offset-equal', () => {
  const input = {
    point: {
      path: [0, 4],
      offset: 3,
    },
    another: {
      path: [0, 1],
      offset: 3,
    },
  }
  const test = ({ point, another }) => {
    return Point.compare(point, another)
  }
  const output = 1

  const result = test(input)
  expect(result).toEqual(output)
})
