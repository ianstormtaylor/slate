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
    text: 'a',
    mark: 'mark',
    decoration: 'decoration',
  },
  {
    text: 'bc',
    mark: 'mark',
  },
]
