import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isSibling-above', () => {
  const input = {
    path: [],
    another: [0, 1],
  }
  const test = ({ path, another }) => {
    return Path.isSibling(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
