import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isPath-strings', () => {
  const input = ['a', 'b']
  const test = path => {
    return Path.isPath(path)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
