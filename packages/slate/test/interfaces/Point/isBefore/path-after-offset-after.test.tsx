import { test, expect } from 'vitest'
import { Point } from 'slate'

test('isBefore-path-after-offset-after', () => {
  const input = {
    point: {
      path: [0, 4],
      offset: 7,
    },
    another: {
      path: [0, 1],
      offset: 3,
    },
  }
  const test = ({ point, another }) => {
    return Point.isBefore(point, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
