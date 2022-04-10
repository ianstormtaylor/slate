import { test, expect } from 'vitest'
import { Point } from 'slate'

test('isPoint-without-offset', () => {
  const input = {
    path: [0, 1],
  }
  const test = value => {
    return Point.isPoint(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
