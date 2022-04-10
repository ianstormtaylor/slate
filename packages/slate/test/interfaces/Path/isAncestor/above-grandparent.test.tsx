import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isAncestor-above-grandparent', () => {
  const input = {
    path: [],
    another: [0, 1],
  }
  const test = ({ path, another }) => {
    return Path.isAncestor(path, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
