import { test, expect } from 'vitest'
import { Path } from 'slate'

test('parent-success', () => {
  const input = [0, 1]
  const test = path => {
    return Path.parent(path)
  }
  const output = [0]

  const result = test(input)
  expect(result).toEqual(output)
})
