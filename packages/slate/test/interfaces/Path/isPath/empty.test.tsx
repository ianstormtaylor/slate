import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isPath-empty', () => {
  const input = []
  const test = path => {
    return Path.isPath(path)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
