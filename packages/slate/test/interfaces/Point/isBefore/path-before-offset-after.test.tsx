import { test, expect } from 'vitest'
import { Point } from 'slate'

test('isBefore-path-before-offset-after', () => {
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
    return Point.isBefore(point, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
