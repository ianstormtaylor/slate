import { test, expect } from 'vitest'
import { Path } from 'slate'

test('compare-root', () => {
  const input = {
    path: [0, 1, 2],
    another: [],
  }
  const test = ({ path, another }) => {
    return Path.compare(path, another)
  }
  const output = 0

  const result = test(input)
  expect(result).toEqual(output)
})
