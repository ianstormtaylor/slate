import { Text } from 'slate'

export const input = [
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
  return Text.decorations({ text: 'abc', mark: 'mark' }, decorations)
}
export const output = [
  {
    leaf: {
      text: 'ab',
      mark: 'mark',
    },
    position: { start: 0, end: 2, isFirst: true },
  },
  {
    leaf: {
      text: 'c',
      mark: 'mark',
      decoration: 'decoration',
    },
    position: { start: 2, end: 3, isLast: true },
  },
]
