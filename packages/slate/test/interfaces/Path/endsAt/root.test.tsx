import { test, expect } from 'vitest'
import { Path } from 'slate'

test('endsAt-root', () => {
  const input = {
    path: [0, 1, 2],
    another: [],
  }
  const test = ({ path, another }) => {
    return Path.endsAt(path, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
