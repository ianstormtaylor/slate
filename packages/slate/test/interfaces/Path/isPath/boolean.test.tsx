import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isPath-boolean', () => {
  const input = true
  const test = path => {
    return Path.isPath(path)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
