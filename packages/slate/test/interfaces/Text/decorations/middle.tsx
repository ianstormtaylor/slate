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
]
export const test = decorations => {
  return Text.decorations({ text: 'abc', mark: 'mark' }, decorations)
}
export const output = [
  {
    text: 'a',
    mark: 'mark',
    start: 0,
    end: 1,
  },
  {
    text: 'b',
    mark: 'mark',
    decoration: 'decoration',
    start: 1,
    end: 2,
  },
  {
    text: 'c',
    mark: 'mark',
    start: 2,
    end: 3,
  },
]
