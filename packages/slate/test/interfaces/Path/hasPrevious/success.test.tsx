import { test, expect } from 'vitest'
import { Path } from 'slate'

test('hasPrevious-success', () => {
  const input = [0, 1]
  const test = path => {
    return Path.hasPrevious(path)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
