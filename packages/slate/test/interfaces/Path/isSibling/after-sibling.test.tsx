import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isSibling-after-sibling', () => {
  const input = {
    path: [1, 4],
    another: [1, 2],
  }
  const test = ({ path, another }) => {
    return Path.isSibling(path, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
