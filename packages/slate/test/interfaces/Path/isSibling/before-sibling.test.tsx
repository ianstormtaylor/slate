import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isSibling-before-sibling', () => {
  const input = {
    path: [0, 1],
    another: [0, 3],
  }
  const test = ({ path, another }) => {
    return Path.isSibling(path, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
