import { Text } from 'slate'

const merge = (leaf: Text, dec: { decoration: number[] }) => {
  const { decoration, ...rest } = dec
  leaf.decoration = [...(leaf.decoration ?? []), ...decoration]
  Object.assign(leaf, rest)
}

export const input = [
  {
    anchor: {
      path: [0],
      offset: 0,
    },
    focus: {
      path: [0],
      offset: 2,
    },
    merge,
    decoration: [1, 2, 3],
  },
  {
    anchor: {
      path: [0],
      offset: 1,
    },
    focus: {
      path: [0],
      offset: 3,
    },
    merge,
    decoration: [4, 5, 6],
  },
]
export const test = decorations => {
  return Text.decorations({ text: 'abc', mark: 'mark' }, decorations)
}
export const output = [
  {
    text: 'a',
    mark: 'mark',
    decoration: [1, 2, 3],
  },
  {
    text: 'b',
    mark: 'mark',
    decoration: [1, 2, 3, 4, 5, 6],
  },
  {
    text: 'c',
    mark: 'mark',
    decoration: [4, 5, 6],
  },
]
