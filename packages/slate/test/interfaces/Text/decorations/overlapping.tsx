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
    decoration1: 'decoration1',
  },
  {
    anchor: {
      path: [0],
      offset: 0,
    },
    focus: {
      path: [0],
      offset: 3,
    },
    decoration2: 'decoration2',
  },
]
export const test = decorations => {
  return Text.decorations({ text: 'abc', mark: 'mark' }, decorations)
}
export const output = [
  {
    text: 'a',
    mark: 'mark',
    decoration2: 'decoration2',
  },
  {
    text: 'b',
    mark: 'mark',
    decoration1: 'decoration1',
    decoration2: 'decoration2',
  },
  {
    text: 'c',
    mark: 'mark',
    decoration2: 'decoration2',
  },
]
