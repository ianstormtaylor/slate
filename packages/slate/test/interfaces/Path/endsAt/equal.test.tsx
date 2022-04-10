import { test, expect } from 'vitest'
import { Path } from 'slate'

test('endsAt-equal', () => {
  const input = {
    path: [0, 1, 2],
    another: [0, 1, 2],
  }
  const test = ({ path, another }) => {
    return Path.endsAt(path, another)
  }
  const output = true

  const result = test(input)
  expect(result).toEqual(output)
})
