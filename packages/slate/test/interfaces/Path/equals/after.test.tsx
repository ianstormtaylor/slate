import { test, expect } from 'vitest'
import { Path } from 'slate'

test('equals-after', () => {
  const input = {
    path: [1, 1, 2],
    another: [0],
  }
  const test = ({ path, another }) => {
    return Path.equals(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
