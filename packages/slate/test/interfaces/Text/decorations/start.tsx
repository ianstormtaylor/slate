import { Text } from 'slate'

export const input = [
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
export const test = decorations => {
  return Text.decorations({ text: 'abc', mark: 'mark' }, decorations)
}
export const output = [
  {
    leaf: {
      text: 'a',
      mark: 'mark',
      decoration: 'decoration',
    },
    position: { start: 0, end: 1, isFirst: true },
  },
  {
    leaf: {
      text: 'bc',
      mark: 'mark',
    },
    position: { start: 1, end: 3, isLast: true },
  },
]
