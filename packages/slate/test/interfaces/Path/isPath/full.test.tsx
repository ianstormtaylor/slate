import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isPath-full', () => {
  const input = [0, 1]
  const test = path => {
    return Path.isPath(path)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
