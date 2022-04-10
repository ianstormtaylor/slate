import { test, expect } from 'vitest'
import { Path } from 'slate'

test('previous-success', () => {
  const input = [0, 1]
  const test = path => {
    return Path.previous(path)
  }
  const output = [0, 0]

  const result = test(input)
  expect(result).toEqual(output)
})
