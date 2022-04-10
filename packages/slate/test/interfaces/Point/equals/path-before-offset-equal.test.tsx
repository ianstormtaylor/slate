import { test, expect } from 'vitest'
import { Point } from 'slate'

test('equals-path-before-offset-equal', () => {
  const input = {
    point: {
      path: [0, 0],
      offset: 0,
    },
    another: {
      path: [0, 1],
      offset: 0,
    },
  }
  const test = ({ point, another }) => {
    return Point.equals(point, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
