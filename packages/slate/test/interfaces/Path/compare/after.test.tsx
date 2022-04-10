import { test, expect } from 'vitest'
import { Path } from 'slate'

test('compare-after', () => {
  const input = {
    path: [1, 1, 2],
    another: [0],
  }
  const test = ({ path, another }) => {
    return Path.compare(path, another)
  }
  const output = 1

  const result = test(input)
  expect(result).toEqual(output)
})
