import { test, expect } from 'vitest'
import { Path } from 'slate'

test('isParent-above-parent', () => {
  const input = {
    path: [0],
    another: [0, 1],
  }
  const test = ({ path, another }) => {
    return Path.isParent(path, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
