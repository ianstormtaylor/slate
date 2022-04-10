import { test, expect } from 'vitest'
import { Range } from 'slate'

test('includes-path-before', () => {
  const input = {
    range: {
      anchor: {
        path: [1],
        offset: 0,
      },
      focus: {
        path: [3],
        offset: 0,
      },
    },
    target: [0],
  }
  const test = ({ range, target }) => {
    return Range.includes(range, target)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
