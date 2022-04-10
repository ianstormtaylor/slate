import { test, expect } from 'vitest'
import { Point } from 'slate'

test('transform-forward-insert-text-before-point', () => {
  const input = {
    path: [0, 0],
    offset: 1,
  }

  const test = value => {
    return Point.transform(
      value,
      {
        type: 'insert_text',
        path: [0, 0],
        text: 'a',
        offset: 0,
        properties: {},
      },
      { affinity: 'forward' }
    )
  }
  const output = {
    path: [0, 0],
    offset: 2,
  }

  const result = test(input)
  expect(result).toEqual(output)
})
