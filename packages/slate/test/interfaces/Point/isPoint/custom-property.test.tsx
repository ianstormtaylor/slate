import { test, expect } from 'vitest'
import { Point } from 'slate'

test('isPoint-custom-property', () => {
  const input = {
    path: [0, 1],
    offset: 0,
    custom: 'value',
  }
  const test = value => {
    return Point.isPoint(value)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
