import { test, expect } from 'vitest'
import { Path } from 'slate'

test('ancestors-success', () => {
  const input = [0, 1, 2]
  const test = path => {
    return Path.ancestors(path)
  }
  const output = [[], [0], [0, 1]]

  const result = test(input)
  expect(result).toEqual(output)
})
