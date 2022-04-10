import { test, expect } from 'vitest'
import { Point } from 'slate'

test('equals-path-equal-offset-equal', () => {
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
    return Point.equals(point, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
