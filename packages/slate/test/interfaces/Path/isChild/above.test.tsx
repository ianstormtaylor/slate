import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isChild-above', () => {
  const input = {
    path: [0],
    another: [0, 1],
  }
  const test = ({ path, another }) => {
    return Path.isChild(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
