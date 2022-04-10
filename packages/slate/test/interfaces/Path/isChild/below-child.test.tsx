import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isChild-below-child', () => {
  const input = {
    path: [0, 1],
    another: [0],
  }
  const test = ({ path, another }) => {
    return Path.isChild(path, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
