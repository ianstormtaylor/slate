import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isSibling-below', () => {
  const input = {
    path: [0, 2],
    another: [0],
  }
  const test = ({ path, another }) => {
    return Path.isSibling(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
