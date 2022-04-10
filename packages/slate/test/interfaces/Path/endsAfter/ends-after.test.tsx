import { test, expect } from 'vitest'
import { Path } from 'slate'

test('endsAfter-ends-after', () => {
  const input = {
    path: [1],
    another: [0, 2],
  }
  const test = ({ path, another }) => {
    return Path.endsAfter(path, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
