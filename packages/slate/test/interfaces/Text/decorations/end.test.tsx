import { test, expect } from 'vitest'
import { Text } from 'slate'

test('decorations-end', () => {
  const input = [
    {
      anchor: {
        path: [0],
        offset: 2,
      },
      focus: {
        path: [0],
        offset: 3,
      },
      decoration: 'decoration',
    },
  ]
  const test = decorations => {
    return Text.decorations({ text: 'abc', mark: 'mark' }, decorations)
  }
  const output = [
    {
      text: 'ab',
      mark: 'mark',
    },
    {
      text: 'c',
      mark: 'mark',
      decoration: 'decoration',
    },
  ]

  const result = test(input)
  expect(result).toEqual(output)
})
