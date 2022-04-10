import { test, expect } from 'vitest'
import { Path } from 'slate'

test('hasPrevious-root', () => {
  const input = [0, 0]
  const test = path => {
    return Path.hasPrevious(path)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
