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
    text: 'ab',
    mark: 'mark',
    start: 0,
    end: 2,
  },
  {
    text: 'c',
    mark: 'mark',
    decoration: 'decoration',
    start: 2,
    end: 3,
  },
]
