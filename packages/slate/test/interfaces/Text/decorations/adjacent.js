import { Text } from 'slate'

export const input = [
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

export const test = decorations => {
  return Text.decorations({ text: 'abcd', mark: 'mark' }, decorations)
}

export const output = [
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
    decoration: 'decoration',
  },
  {
    text: 'd',
    mark: 'mark',
  },
]
