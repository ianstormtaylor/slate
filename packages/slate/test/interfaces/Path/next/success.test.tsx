import { test, expect } from 'vitest'
import { Path } from 'slate'

test('next-success', () => {
  const input = [0, 1]
  const test = path => {
    return Path.next(path)
  }
  const output = [0, 2]

  const result = test(input)
  expect(result).toEqual(output)
})
