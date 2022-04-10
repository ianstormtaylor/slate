import { test, expect } from 'vitest'
import { Path } from 'slate'

test('endsBefore-ends-before', () => {
  const input = {
    path: [0],
    another: [1, 2],
  }
  const test = ({ path, another }) => {
    return Path.endsBefore(path, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
