import { test, expect } from 'vitest'
import { Path } from 'slate'

test('endsAt-ends-after', () => {
  const input = {
    path: [1],
    another: [0, 2],
  }
  const test = ({ path, another }) => {
    return Path.endsAt(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
