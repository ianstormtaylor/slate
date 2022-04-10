import { test, expect } from 'vitest'
import { Path } from 'slate'

test('levels-success', () => {
  const input = [0, 1, 2]
  const test = path => {
    return Path.levels(path)
  }
  const output = [[], [0], [0, 1], [0, 1, 2]]

  const result = test(input)
  expect(result).toEqual(output)
})
