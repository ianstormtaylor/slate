import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isParent-above-grandparent', () => {
  const input = {
    path: [],
    another: [0, 1],
  }
  const test = ({ path, another }) => {
    return Path.isParent(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
