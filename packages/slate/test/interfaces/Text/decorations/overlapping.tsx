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
    position: { start: 0, end: 1, isFirst: true, isLast: false },
  },
  {
    text: 'b',
    mark: 'mark',
    decoration1: 'decoration1',
    decoration2: 'decoration2',
    position: { start: 1, end: 2, isFirst: false, isLast: false },
  },
  {
    text: 'c',
    mark: 'mark',
    decoration2: 'decoration2',
    position: { start: 2, end: 3, isFirst: false, isLast: true },
  },
]
