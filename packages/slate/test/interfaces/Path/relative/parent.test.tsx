import { test, expect } from 'vitest'
import { Path } from 'slate'

test('relative-parent', () => {
  const input = {
    path: [0, 1],
    another: [0],
  }
  const test = ({ path, another }) => {
    return Path.relative(path, another)
  }
  const output = [1]

  const result = test(input)
  expect(result).toEqual(output)
})
