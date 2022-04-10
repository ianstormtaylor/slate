import { test, expect } from 'vitest'
import { Path } from 'slate'

test('levels-reverse', () => {
  const input = [0, 1, 2]
  const test = path => {
    return Path.levels(path, { reverse: true })
  }
  const output = [[0, 1, 2], [0, 1], [0], []]

  const result = test(input)
  expect(result).toEqual(output)
})
