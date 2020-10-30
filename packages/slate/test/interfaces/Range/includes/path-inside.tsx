import { SlateRange } from 'slate'

export const input = {
  range: {
    anchor: {
      path: [1],
      offset: 0,
    },
    focus: {
      path: [3],
      offset: 0,
    },
  },
  target: [2],
}
export const test = ({ range, target }) => {
  return SlateRange.includes(range, target)
}
export const output = true
