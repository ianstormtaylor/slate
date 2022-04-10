import { test, expect } from 'vitest'
import { Text } from 'slate'

test('decorations-adjacent', () => {
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
      decoration1: 'decoration1',
    },
    {
      anchor: {
        path: [0],
        offset: 2,
      },
      focus: {
        path: [0],
        offset: 3,
      },
      decoration2: 'decoration2',
    },
  ]

  const test = decorations => {
    return Text.decorations({ text: 'abcd', mark: 'mark' }, decorations)
  }

  const output = [
    {
      text: 'a',
      mark: 'mark',
    },
    {
      text: 'b',
      mark: 'mark',
      decoration1: 'decoration1',
    },
    {
      text: 'c',
      mark: 'mark',
      decoration2: 'decoration2',
    },
    {
      text: 'd',
      mark: 'mark',
    },
  ]

  const result = test(input)
  expect(result).toEqual(output)
})
