import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isAncestor-equal', () => {
  const input = {
    path: [0, 1, 2],
    another: [0, 1, 2],
  }
  const test = ({ path, another }) => {
    return Path.isAncestor(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
