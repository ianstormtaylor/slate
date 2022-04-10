import { test, expect } from 'vitest'
import { Range } from 'slate'

test('transform-inward-collapsed', () => {
  const input = {
    anchor: {
      path: [0, 0],
      offset: 1,
    },
    focus: {
      path: [0, 0],
      offset: 1,
    },
  }
  const test = value => {
    return Range.transform(
      value,
      {
        type: 'split_node',
        path: [0, 0],
        position: 1,
        properties: {},
      },
      { affinity: 'inward' }
    )
  }
  const output = {
    anchor: {
      path: [0, 1],
      offset: 0,
    },
    focus: {
      path: [0, 1],
      offset: 0,
    },
  }

  const result = test(input)
  expect(result).toEqual(output)
})
