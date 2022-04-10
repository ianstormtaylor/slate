import { test, expect } from 'vitest'
import { Path } from 'slate'

test('common-equal', () => {
  const input = {
    path: [0, 1, 2],
    another: [0, 1, 2],
  }
  const test = ({ path, another }) => {
    return Path.common(path, another)
  }
  const output = [0, 1, 2]

  const result = test(input)
  expect(result).toEqual(output)
})
