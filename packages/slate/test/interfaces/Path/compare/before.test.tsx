import { test, expect } from 'vitest'
import { Path } from 'slate'

test('compare-before', () => {
  const input = {
    path: [0, 1, 2],
    another: [1],
  }
  const test = ({ path, another }) => {
    return Path.compare(path, another)
  }
  const output = -1

  const result = test(input)
  expect(result).toEqual(output)
})
