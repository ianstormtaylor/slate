import { test, expect } from 'vitest'
import { Range } from 'slate'

test('equals-not-equal', () => {
  const input = {
    range: {
      anchor: {
        path: [0, 4],
        offset: 7,
      },
      focus: {
        path: [0, 4],
        offset: 7,
      },
    },
    another: {
      anchor: {
        path: [0, 1],
        offset: 0,
      },
      focus: {
        path: [0, 1],
        offset: 0,
      },
    },
  }
  const test = ({ range, another }) => {
    return Range.equals(range, another)
  }
  const output = false

  const result = test(input)
  expect(result).toEqual(output)
})
