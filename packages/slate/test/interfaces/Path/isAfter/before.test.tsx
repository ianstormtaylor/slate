import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isAfter-before', () => {
  const input = {
    path: [0, 1, 2],
    another: [1],
  }
  const test = ({ path, another }) => {
    return Path.isAfter(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
