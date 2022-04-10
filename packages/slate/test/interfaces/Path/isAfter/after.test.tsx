import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isAfter-after', () => {
  const input = {
    path: [1, 1, 2],
    another: [0],
  }
  const test = ({ path, another }) => {
    return Path.isAfter(path, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
