import { test, expect } from 'vitest'
import { Point } from 'slate'

test('transform-backward-insert-text-at-point', () => {
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
        offset: 1,
        properties: {},
      },
      { affinity: 'backward' }
    )
  }
  const output = {
    path: [0, 0],
    offset: 1,
  }

  const result = test(input)
  expect(result).toEqual(output)
})
