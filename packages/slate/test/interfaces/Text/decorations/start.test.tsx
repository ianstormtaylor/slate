import { test, expect } from 'vitest'
import { Text } from 'slate'

test('decorations-start', () => {
  const input = [
    {
      anchor: {
        path: [0],
        offset: 0,
      },
      focus: {
        path: [0],
        offset: 1,
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
      decoration: 'decoration',
    },
    {
      text: 'bc',
      mark: 'mark',
    },
  ]

  const result = test(input)
  expect(result).toEqual(output)
})
