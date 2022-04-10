import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isBefore-below', () => {
  const input = {
    path: [0, 1, 2],
    another: [0],
  }
  const test = ({ path, another }) => {
    return Path.isBefore(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
