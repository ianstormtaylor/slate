import { test, expect } from 'vitest'
import { Path } from 'slate'

test('endsAt-ends-before', () => {
  const input = {
    path: [0],
    another: [1, 2],
  }
  const test = ({ path, another }) => {
    return Path.endsAt(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
