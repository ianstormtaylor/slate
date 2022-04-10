import { test, expect } from 'vitest'
import { Path } from 'slate'

test('relative-root', () => {
  const input = {
    path: [0, 1],
    another: [],
  }
  const test = ({ path, another }) => {
    return Path.relative(path, another)
  }
  const output = [0, 1]

  const result = test(input)
  expect(result).toEqual(output)
})
