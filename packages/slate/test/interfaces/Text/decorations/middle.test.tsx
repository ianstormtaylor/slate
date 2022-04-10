import { test, expect } from 'vitest'
import { Text } from 'slate'

test('decorations-middle', () => {
  const input = [
    {
      anchor: {
        path: [0],
        offset: 1,
      },
      focus: {
        path: [0],
        offset: 2,
      },
      decoration: 'decoration',
    },
  ]
  const test = decorations => {
    return Text.decorations({ text: 'abc', mark: 'mark' }, decorations)
  }
  const output = [
    {
      text: 'a',
      mark: 'mark',
    },
    {
      text: 'b',
      mark: 'mark',
      decoration: 'decoration',
    },
    {
      text: 'c',
      mark: 'mark',
    },
  ]

  const result = test(input)
  expect(result).toEqual(output)
})
