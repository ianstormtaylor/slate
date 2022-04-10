import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isChild-below-grandchild', () => {
  const input = {
    path: [0, 1],
    another: [],
  }
  const test = ({ path, another }) => {
    return Path.isChild(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
