import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isDescendant-below-grandchild', () => {
  const input = {
    path: [0, 1],
    another: [],
  }
  const test = ({ path, another }) => {
    return Path.isDescendant(path, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
