import { test, expect } from 'vitest'
import { Point } from 'slate'

test('isPoint-object', () => {
  const input = {}
  const test = value => {
    return Point.isPoint(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
