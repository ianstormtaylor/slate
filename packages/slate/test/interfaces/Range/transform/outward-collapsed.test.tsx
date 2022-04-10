import { test, expect } from 'vitest'
import { Range } from 'slate'

test('transform-outward-collapsed', () => {
  /**
   * If a collapsed Range is transformed with affinity outward by an insert_text operation, it should expand.
   */

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
        type: 'insert_text',
        path: [0, 0],
        text: 'a',
        offset: 1,
        properties: {},
      },
      { affinity: 'outward' }
    )
  }
  const output = {
    anchor: {
      path: [0, 0],
      offset: 1,
    },
    focus: {
      path: [0, 0],
      offset: 2,
    },
  }

  const result = test(input)
  expect(result).toEqual(output)
})
