import { test, expect } from 'vitest'
import { Point } from 'slate'

test('isPoint-boolean', () => {
  const input = true
  const test = value => {
    return Point.isPoint(value)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
