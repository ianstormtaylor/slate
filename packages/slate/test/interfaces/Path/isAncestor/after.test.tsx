import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isAncestor-after', () => {
  const input = {
    path: [1, 1, 2],
    another: [0],
  }
  const test = ({ path, another }) => {
    return Path.isAncestor(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
