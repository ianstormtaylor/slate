import { test, expect } from 'vitest'
import { Path } from 'slate'

test('common-root', () => {
  const input = {
    path: [0, 1, 2],
    another: [3, 2],
  }
  const test = ({ path, another }) => {
    return Path.common(path, another)
  }
  const output = []

  const result = test(input)
  expect(result).toEqual(output)
})
