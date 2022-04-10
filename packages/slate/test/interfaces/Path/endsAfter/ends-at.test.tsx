import { test, expect } from 'vitest'
import { Path } from 'slate'

test('endsAfter-ends-at', () => {
  const input = {
    path: [0],
    another: [0, 2],
  }
  const test = ({ path, another }) => {
    return Path.endsAfter(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
