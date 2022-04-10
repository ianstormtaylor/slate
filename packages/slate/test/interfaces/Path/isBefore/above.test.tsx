import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isBefore-above', () => {
  const input = {
    path: [0],
    another: [0, 1],
  }
  const test = ({ path, another }) => {
    return Path.isBefore(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
